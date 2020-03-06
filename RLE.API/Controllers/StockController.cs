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
        private readonly IEducNotesRepository _repo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        string password;

        private readonly UserManager<User> _userManager;
        int operatorTypeId;
        public StockController(IConfiguration config, DataContext context, IEducNotesRepository repo,
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
            var tablets = await _context.Tablets.Where(s => s.StoreId == storeId)
                                                .OrderBy(a => a.Imei).ToListAsync();
            if (tablets.Count() > 0)
                return Ok(tablets);

            return NotFound();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P O S T///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost("StockAllocation/{insertUserId}")]
        public async Task<IActionResult> StockAllocation(int insertUserId, StockAllocationDto stockAllocationDto)
        {
            int ToStoreId = stockAllocationDto.ToStoreId;
            int ceiStoreid = _config.GetValue<int>("AppSettings:CEIStoreId");
            if (ToStoreId == ceiStoreid)
            {
                var toStore = await _context.Stores.FirstOrDefaultAsync
                                            (a => a.RegionId == stockAllocationDto.RegionId && a.DepartmentId == stockAllocationDto.DepartmentId);
                if (toStore == null)
                {
                    // creation d'un nouveau store
                    var newStore = new Store
                    {
                        StorePId = ceiStoreid,
                        StoreTypeId = _config.GetValue<int>("AppSettings:clientStoretypeId"),
                        Name = "MAG CEI - " +(await _context.Departments.FirstOrDefaultAsync(a => a.Id == Convert.ToInt32(stockAllocationDto.DepartmentId))).Name,
                        RegionId = stockAllocationDto.RegionId,
                        DepartmentId = stockAllocationDto.DepartmentId
                    };
                    _context.Add(newStore);
                    ToStoreId = newStore.Id;
                }
                else
                {
                    ToStoreId = toStore.Id;
                }
            }
            int inventOpTypeId = (int)InventOpType.TypeEnum.StockEntry;
            var stckMvt = new StockMvt
            {
                ToStoreId = ToStoreId,
                FromStoreId = stockAllocationDto.FromStoreId,
                MvtDate = stockAllocationDto.Mvtdate,
                InsertUserId = insertUserId,
                RefNum = stockAllocationDto.RefNum,
                InventOpTypeId = inventOpTypeId
            };
            _context.Add(stckMvt);

            foreach (var imei in stockAllocationDto.Imeis)
            {
                var tablet = new Tablet
                {
                    Imei = imei,
                    StoreId = ToStoreId,
                    Type = false,
                    Status = 1,
                    Active = false
                };
                _context.Add(tablet);

                var inventOp = new InventOp
                {
                    FormNum = stockAllocationDto.RefNum,
                    OpDate = stockAllocationDto.Mvtdate,
                    FromStoreId = stockAllocationDto.FromStoreId,
                    ToStoreId = ToStoreId,
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