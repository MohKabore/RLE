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
    public class StockController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IStockRepository _repo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        string password;

        private readonly UserManager<User> _userManager;
        int operatorTypeId;
        public StockController(IConfiguration config, DataContext context, IStockRepository repo,
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

        [HttpGet("StoreTablets/{storeId}")]
        public async Task<IActionResult> StoreTablets(int storeId)
        {
            var tablets = await _repo.StoreTablets(storeId);

            if (tablets.Count() > 0)
                return Ok(tablets);

            return NotFound();
        }

        [HttpGet("MaintainerTablets/{maintainerId}")]
        public async Task<IActionResult> MaintainerTablets(int maintainerId)
        {
            var tablets = await _repo.MaintainairTablets(maintainerId);

            if (tablets.Count() > 0)
                return Ok(tablets);

            return NotFound();
        }

        [HttpGet("TabletTypes")]
        public async Task<IActionResult> TabletTypes()
        {
            var tabletTypes = await _context.TabletTypes.OrderBy(t=>t.Name).ToListAsync();
            return Ok(tabletTypes);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P O S T///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost("StockAllocation/{tabletTypeId}/{insertUserId}")]
        public async Task<IActionResult> StockAllocation(int insertUserId,int tabletTypeId, StockAllocationDto stockAllocationDto)
        {
            await _repo.StockAllocation(insertUserId,tabletTypeId, stockAllocationDto);
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpPost("TabletAllocation/{insertUserId}")]
        public async Task<IActionResult> TabletAllocation(int insertUserId, StockAllocationDto stockAllocationDto)
        {

           _repo.TabletAllocation(insertUserId, stockAllocationDto);
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPost("ApproSphare/{insertUserId}")]
        public async Task<IActionResult> ApproSphare(int insertUserId, StockAllocationDto approSphareDto)
        {
            var store = await _context.Stores.FirstOrDefaultAsync(a => a.EmployeeId == approSphareDto.ToEmployeeId);
            int toStoreId = 0;
            if (store != null)
                toStoreId = store.Id;
            else
            {
                var employee = await _context.Users.FirstOrDefaultAsync(a => a.Id == Convert.ToInt32(approSphareDto.ToEmployeeId));
                var st = new Store
                {
                    EmployeeId = approSphareDto.ToEmployeeId,
                    RegionId = employee.RegionId,
                    StoreTypeId = _config.GetValue<int>("AppSettings:magStoretypeId"),
                    DepartmentId = employee.DepartmentId,
                    StorePId = _config.GetValue<int>("AppSettings:ATStoreId")
                };
                _repo.Add(st);
                toStoreId = st.Id;
            }
            int inventOpTypeId = (int)InventOpType.TypeEnum.StockAllocation;
            var stckMvt = new StockMvt
            {
                ToStoreId = toStoreId,
                FromStoreId = approSphareDto.FromStoreId,
                MvtDate = approSphareDto.Mvtdate,
                InsertUserId = insertUserId,
                RefNum = approSphareDto.RefNum,
                InventOpTypeId = inventOpTypeId
            };
            _context.Add(stckMvt);

            foreach (var tabletId in approSphareDto.TabletIds)
            {
                var tablet = await _context.Tablets.FirstOrDefaultAsync(t => t.Id == tabletId);
                tablet.StoreId = toStoreId;
                _context.Update(tablet);

                var inventOp = new InventOp
                {
                    FormNum = approSphareDto.RefNum,
                    InsertUserId = insertUserId,
                    OpDate = approSphareDto.Mvtdate,
                    FromStoreId = approSphareDto.FromStoreId,
                    ToStoreId = toStoreId,
                    TabletId = tablet.Id,
                    InventOpTypeId = inventOpTypeId
                };
                _context.Add(inventOp);

                var stkMvtinventOp = new StockMvtInventOp
                {
                    StockMvtId = stckMvt.Id,
                    InventOpId = inventOp.Id
                };
                _context.Add(stkMvtinventOp);
            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPost("BackSphare/{insertUserId}")]
        public async Task<IActionResult> BackSphare(int insertUserId, StockAllocationDto backTabletDto)
        {
            var fromStoreId = (await _context.Stores.FirstOrDefaultAsync(a => a.EmployeeId == backTabletDto.FromEmployeeId)).Id;
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
            var stckMvt = new StockMvt
            {
                ToStoreId = backTabletDto.ToStoreId,
                FromStoreId = fromStoreId,
                MvtDate = backTabletDto.Mvtdate,
                InsertUserId = insertUserId,
                RefNum = backTabletDto.RefNum,
                InventOpTypeId = inventOpTypeId
            };
            _context.Add(stckMvt);

            foreach (var tabletId in backTabletDto.TabletIds)
            {
                var tablet = await _context.Tablets.FirstOrDefaultAsync(t => t.Id == tabletId);
                tablet.StoreId = backTabletDto.ToStoreId;
                _context.Update(tablet);

                var inventOp = new InventOp
                {
                    FormNum = backTabletDto.RefNum,
                    OpDate = backTabletDto.Mvtdate,
                    InsertUserId = insertUserId,
                    FromStoreId = fromStoreId,
                    ToStoreId = backTabletDto.ToStoreId,
                    TabletId = tablet.Id,
                    InventOpTypeId = inventOpTypeId
                };
                _context.Add(inventOp);

                var stkMvtinventOp = new StockMvtInventOp
                {
                    StockMvtId = stckMvt.Id,
                    InventOpId = inventOp.Id
                };
                _context.Add(stkMvtinventOp);
            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P U T ///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }


}