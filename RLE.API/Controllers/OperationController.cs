using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using RLE.API.Data;
using RLE.API.Dtos;
using RLE.API.Helpers;
using RLE.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;
using System.Text.Encodings.Web;

namespace RLE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IEducNotesRepository _repo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        string password;

        private readonly UserManager<User> _userManager;
        int operatorTypeId;
        public OperationController(IConfiguration config, DataContext context, IEducNotesRepository repo,
        UserManager<User> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _config = config;
            _context = context;
            _repo = repo;
            _mapper = mapper;
            password = _config.GetValue<String>("AppSettings:defaultPassword");
            operatorTypeId = _config.GetValue<int>("AppSettings:OperatorTypeId");
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// G E T ///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P O S T///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPost("VerifyImeis")]
        public async Task<IActionResult> VerifyImeis(List<string> imeis)
        {
            var imeisToReturn = new List<ImeiVerificationDto>();
            var tabets = await _context.Tablets.Include(s => s.Store)
                                                .ThenInclude(s => s.Department)
                                                .ThenInclude(s => s.Region)
                                                .Where(i => imeis.Contains(i.Imei) && i.StoreId != null)
                                                .ToListAsync();
            foreach (var imei in imeis)
            {
                var tab = tabets.FirstOrDefault(i => i.Imei == imei);
                if (tab != null)
                {
                    imeisToReturn.Add(new ImeiVerificationDto
                    {
                        Id = tab.Id,
                        Imei = tab.Imei,
                        StoreId = tab.StoreId,
                        Exist = true,
                        Store = tab.Store
                    });
                }
                else
                {
                    imeisToReturn.Add(new ImeiVerificationDto
                    {
                        Imei = imei,
                        Exist = false
                    });
                }
            }

            return Ok(imeisToReturn);
        }

        [HttpPost("VerifyEcCodes")]
        public async Task<IActionResult> VerifyEcCodes(List<EcCodeSearchDto> ecCodes)
        {
            var codes = ecCodes.Select(a => a.EcCode);
            var ecs = await _context.EnrolmentCenters.Include(m => m.Municipality)
                                                    .ThenInclude(m => m.City)
                                                    .ThenInclude(m => m.Department)
                                                    .ThenInclude(m => m.Region)
                                                    .Where(m => codes.Contains(m.Municipality.City.Department.Region.Code + '-' +
                                                        m.Municipality.City.Department.Code + '-' +
                                                        m.Municipality.City.Code + '-' +
                                                        m.Municipality.Code + '-' +
                                                        m.Code))
                                                    .ToListAsync();

            var ecsToReturn = new List<EcCodeToVerify>();
            foreach (var eccode in ecCodes)
            {
                var ec = ecs.FirstOrDefault(a => a.Municipality.City.Department.Region.Code + '-' + a.Municipality.City.Department.Code + '-' +
                                            a.Municipality.City.Code + '-' + a.Municipality.Code + '-' + a.Code == eccode.EcCode);
                if (ec != null)
                {
                    ecsToReturn.Add(new EcCodeToVerify
                    {
                        Id = ec.Id,
                        Code = ec.Code,
                        Name = ec.Name,
                        Exist = true,
                        MunicipalityId = ec.MunicipalityId,
                        Municipality = ec.Municipality,
                        Indx = eccode.Indx
                    });
                }

                else
                {
                    ecsToReturn.Add(new EcCodeToVerify
                    {
                        Code = eccode.EcCode,
                        Indx = eccode.Indx,
                        Exist = false
                    });
                }
            }

            return Ok(ecsToReturn);


        }


        [HttpPost("AssignOp/{insertUserId}")]
        public async Task<IActionResult> BackSphare(int insertUserId, OpAssignmentDto model)
        {
            var tablet = await _context.Tablets.FirstOrDefaultAsync(t => t.Id == model.TabletId);
            var fromStoreId = tablet.StoreId;
            // int toStoreId = 0;
            // if (store != null)
            //     toStoreId = store.Id;
            // else
            // {
            //     var employee = await _context.Users.FirstOrDefaultAsync(a => a.Id == Convert.ToInt32(approSphareDto.ToEmployeeId));
            //     var st = new Store
            //     {
            //         EmployeeId = approSphareDto.ToEmployeeId,
            //         RegionId = employee.RegionId,
            //         StoreTypeId =  _config.GetValue<int>("AppSettings:magStoretypeId"),
            //         DepartmentId = employee.DepartmentId,
            //         StorePId = _config.GetValue<int>("AppSettings:ATStoreId")
            //     };
            //     _repo.Add(st);
            //     toStoreId = st.Id;
            // }
            int inventOpTypeId = (int)InventOpType.TypeEnum.StockAllocation;

            var inventOp = new InventOp
            {
                OpDate = model.OpDate,
                InsertUserId = insertUserId,
                FromStoreId = fromStoreId,
                ToEmployeeId = model.EmployeeId,
                TabletId = tablet.Id,
                InventOpTypeId = inventOpTypeId
            };
            _repo.Add(inventOp);

            tablet.StoreId = null;
            _repo.Update(tablet);

            var op = await _context.Users.FirstOrDefaultAsync(t => t.Id == model.EmployeeId);
            op.TabletId = model.TabletId;
            op.Active = true;
            op.EnrolmentCenterId = model.enrolmentCenterId;
            _repo.Update(op);


            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }


        [HttpPost("AffectNewUsers/{insertUserId}")]
        public async Task<IActionResult> AffectNewwUsers(int insertUserId, List<UserForRegisterDto> usersForRegister)
        {
            var finalResult = false;

            using (var identityContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var model in usersForRegister)
                    {
                        var userName = Guid.NewGuid();
                        var userToCreate = _mapper.Map<User>(model);
                        userToCreate.Active = true;
                        userToCreate.UserName = userName.ToString();
                        userToCreate.ValidationCode = userName.ToString();
                        var result = await _userManager.CreateAsync(userToCreate, password);


                        // var userToReturn = _mapper.Map<UserForDetailedDto>(userToCreate);

                        if (result.Succeeded)
                        {
                            var userId = userToCreate.Id;
                            var tablet = await _context.Tablets.FirstOrDefaultAsync(t => t.Id == model.TabletId);

                            int inventOpTypeId = (int)InventOpType.TypeEnum.StockAllocation;

                            var inventOp = new InventOp
                            {
                                OpDate = Convert.ToDateTime(model.OpDate),
                                InsertUserId = insertUserId,
                                FromStoreId = Convert.ToInt32(model.StoreId),
                                ToEmployeeId = userId,
                                TabletId = Convert.ToInt32(model.TabletId),
                                InventOpTypeId = inventOpTypeId
                            };
                            _repo.Add(inventOp);

                            tablet.StoreId = null;
                            _repo.Update(tablet);

                        }
                    }
                    if (await _repo.SaveAll())
                    {
                        identityContextTransaction.Commit();
                        finalResult = true;
                    }
                    else
                        finalResult = false;
                }
                catch (System.Exception ex)
                {
                    identityContextTransaction.Rollback();
                    finalResult = false;
                }


            }
            if (finalResult)
                return Ok();

            return BadRequest();

        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P U T ///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }


}