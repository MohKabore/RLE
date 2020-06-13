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
            var tabletTypes = await _context.TabletTypes.OrderBy(t => t.Name).ToListAsync();
            return Ok(tabletTypes);
        }

        [HttpGet("DepartmentTablets/{departmentId}")]
        public async Task<IActionResult> DepartmentTablets(int departmentId)
        {
            var tabletsToReturn = new List<TabletDetailDto>();
            var deptStores = await _context.Stores.Include(t => t.Tablets).Where(t => t.EmployeeId == null && t.DepartmentId == departmentId).ToListAsync();
            if (deptStores.Count() > 0)
            {
                foreach (var deptStore in deptStores)
                {
                    foreach (var tablet in deptStore.Tablets)
                    {
                        if (tablet.Status == 1)
                        {
                            var t = _mapper.Map<TabletDetailDto>(tablet);
                            t.StoreName = deptStore.Name;
                            t.StoreId = deptStore.Id;
                            tabletsToReturn.Add(t);
                        }
                    }
                }
            }
            var operators = await _context.Users.Include(u => u.Tablet).Where(u => u.TabletId != null && u.DepartmentId == departmentId).ToListAsync();
            if (operators.Count() > 0)
            {
                foreach (var op in operators)
                {
                    if (op.Tablet.Status == 1)
                    {
                        var t = _mapper.Map<TabletDetailDto>(op.Tablet);
                        t.EmployeeId = op.Id;
                        t.EmpName = op.LastName + " " + op.FirstName;
                        tabletsToReturn.Add(t);
                    }
                }
            }

            return Ok(tabletsToReturn);
        }

        [HttpGet("GetTabletByImei/{imei}")]
        public async Task<IActionResult> GetTabletByImei(string imei)
        {
            var tablet = await _repo.GetTabletByImei(imei);
            return Ok(tablet);
        }

        [HttpGet("GetStoreTabletByImei/{storeId}/{imei}")]
        public async Task<IActionResult> GetStoreTabletByImei(int storeId, string imei)
        {
            var tablet = await _context.Tablets.FirstOrDefaultAsync(t => t.StoreId == storeId && t.Imei == imei);
            return Ok(tablet);
        }

        [HttpGet("GetDeclaredFailures")]
        public async Task<IActionResult> GetDeclaredFailures()
        {
            var data = _context.Failures.Include(i => i.Tablet).Include(i => i.FailureList1).Include(i => i.FieldTech1)
                .Include(i => i.RepairAction1).Where(i => i.Repaired == (int)Failure.RepairedEnum.MaintAskedNOK || i.Repaired == (int)Failure.RepairedEnum.WaitingMaint);

            return Ok(await data.ToListAsync());
        }

        [HttpGet("GetFailure/{failureId}")]
        public async Task<IActionResult> GetFailure(int failureId)
        {
            var failure = await _context.Failures.Include(f => f.Tablet).Include(f => f.FailureList1).FirstOrDefaultAsync(f => f.Id == failureId);
            if (failure != null)
                return Ok(failure);
            return NotFound();
        }

        [HttpGet("TabletDetails/{tabletId}")]
        public async Task<IActionResult> TabletDetails(int tabletId)
        {
            var inventOp = await _context.InventOps
                                .Include(a => a.FromStore)
                                .Include(a => a.ToStore)
                                .Include(a => a.Failure)
                                .Include(a => a.Failure.FailureList1)
                                .Include(a => a.Failure.FailureList2)
                                .Include(a => a.Failure.RepairAction1)
                                .Include(a => a.Failure.RepairAction2)
                                .Include(a => a.FromStore)
                                .Include(a => a.EcData.Region)
                                .Include(a => a.FromStore.Employee)
                                .Include(a => a.ToStore.Employee)
                                .Include(a => a.Tablet)
                                .Include(a => a.EcData)
                                .Include(a => a.TabletEx)
                                .Where(a => a.TabletId == tabletId || a.TabletExId == tabletId)
                                .OrderBy(a => a.OpDate)
                                .ThenBy(a => a.InsertDate)
                                .ToListAsync();

            return Ok(inventOp);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P O S T///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost("StockAllocation/{tabletTypeId}/{insertUserId}")]
        public async Task<IActionResult> StockAllocation(int insertUserId, int tabletTypeId, StockAllocationDto stockAllocationDto)
        {
            await _repo.StockAllocation(insertUserId, tabletTypeId, stockAllocationDto);
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

        [HttpPost("SaveFailure/{insertUserId}")]
        public async Task<IActionResult> SaveFailure(int insertUserId, FailureToSaveDto failureToSaveDto)
        {
            var finalResult = false;
            byte repaired;
            DateTime now = DateTime.Now;
            string year = now.Year.ToString();
            string month = now.Month.ToString();
            month = month.Length == 1 ? "0" + month : month;
            string day = now.Day.ToString();
            day = day.Length == 1 ? "0" + day : day;
            string hour = now.Hour.ToString();
            hour = hour.Length == 1 ? "0" + hour : hour;
            string min = now.Minute.ToString();
            min = min.Length == 1 ? "0" + min : min;
            var tablet = new Tablet();

            string ticket = year.Substring(2) + month + day + hour + min + "-" + failureToSaveDto.Imei;

            int InventOpTypeId = (int)InventOpType.TypeEnum.Failure;

            if (Convert.ToBoolean(failureToSaveDto.Repaired) == true)
                repaired = (int)Failure.RepairedEnum.OKHotline;
            else
            {

                if (failureToSaveDto.Joined == true)
                    repaired = (int)Failure.RepairedEnum.MaintAskedNOK;
                else
                    repaired = (int)Failure.RepairedEnum.WaitingMaint;
            }
            if (failureToSaveDto.TabletId != null)
                tablet = await _context.Tablets.FirstOrDefaultAsync(a => a.Id == failureToSaveDto.TabletId);


            using (var identityContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var failureToCreate = _mapper.Map<Failure>(failureToSaveDto);
                    failureToCreate.Ticket = ticket;
                    failureToCreate.User1Id = insertUserId;
                    failureToCreate.Repaired = repaired;
                    _repo.Add(failureToCreate);
                    if (failureToSaveDto.Repaired != 1 && failureToSaveDto.TabletId != null)
                    {
                        tablet.Status = 0;
                        _repo.Update(tablet);
                    }
                    if (failureToSaveDto.TabletId != null)
                    {
                        var InventOp = new InventOp
                        {
                            TabletId = Convert.ToInt32(failureToSaveDto.TabletId),
                            OpDate = failureToSaveDto.FailureDate,
                            FailureId = failureToCreate.Id,
                            InventOpTypeId = InventOpTypeId,
                            FromStoreId = tablet.StoreId
                        };

                        _repo.Add(InventOp);
                    }

                    if (await _repo.SaveAll())
                    {
                        finalResult = true;
                        identityContextTransaction.Commit();
                    }

                }
                catch (System.Exception)
                {
                    identityContextTransaction.Rollback();
                    finalResult = false;
                }
            }

            if (finalResult)
                return Ok();

            return BadRequest();
        }

        [HttpPost("SaveMaintenance/{failureId}/{insertUserId}")]
        public async Task<IActionResult> SaveMaintenance(int failureId, int insertUserId, FailureToSaveDto failureToSaveDto)
        {
            bool finalResult = false;
            byte repaired = 0;
            if (Convert.ToBoolean(failureToSaveDto.Repaired) == true)
                repaired = (int)Failure.RepairedEnum.OKMaint;
            else
                repaired = (int)Failure.RepairedEnum.OKExchange;


            using (var identityContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var savedFailure = await _context.Failures.FirstOrDefaultAsync(t => t.Id == failureId);
                    savedFailure.MaintDate = failureToSaveDto.MaintDate;
                    savedFailure.TabletExId = failureToSaveDto.TabletExId;
                    savedFailure.FailureList2Id = failureToSaveDto.FailureList2Id;
                    savedFailure.RepairAction2Id = failureToSaveDto.RepairAction2Id;
                    savedFailure.FieldTech2Id = failureToSaveDto.FieldTech2Id;
                    savedFailure.Note2 = failureToSaveDto.Note2;
                    savedFailure.Hotliner2Id = failureToSaveDto.Hotliner2Id;
                    savedFailure.Repaired = repaired;
                    _repo.Update(savedFailure);
                    if (failureToSaveDto.TabletExId != null) // echange tablette
                    {
                        int? tabletStoreId = null, tabletExStoreId = null;
                        var tablet = new Tablet();
                        if (failureToSaveDto.TabletId != null)
                        {
                            tablet = await _context.Tablets.FirstOrDefaultAsync(u => u.Id == savedFailure.TabletId);
                            tabletStoreId = tablet.StoreId;
                        }
                        var tabletEx = await _context.Tablets.FirstOrDefaultAsync(u => u.Id == savedFailure.TabletExId);
                        tabletExStoreId = tabletEx.StoreId;

                        int InventOpTypeId = (int)InventOpType.TypeEnum.Maintenance;

                        var inventOp = new InventOp
                        {
                            TabletId = failureToSaveDto.TabletId,
                            TabletExId = tabletEx.Id,
                            OpDate = Convert.ToDateTime(failureToSaveDto.MaintDate),
                            InventOpTypeId = InventOpTypeId,
                            FromStoreId = tabletExStoreId,
                            ToStoreId = tabletStoreId,
                            FailureId = failureId
                        };
                        _repo.Add(inventOp);
                        tabletEx.StoreId = tabletStoreId;
                        _repo.Update(tabletEx);

                        if (failureToSaveDto.TabletId != null)
                        {
                            tablet.StoreId = tabletExStoreId;
                            _repo.Update(tablet);
                        }

                    }
                    if (await _repo.SaveAll())
                    {
                        finalResult = true;
                        identityContextTransaction.Commit();
                    }

                }
                catch (System.Exception)
                {
                    identityContextTransaction.Rollback();
                    finalResult = false;
                }
            }

            if (finalResult)
                return Ok();

            return BadRequest();

        }

        [HttpPost("SaveEcData/{insertUserId}")]
        public async Task<IActionResult> SaveEcData(int insertUserId, EcDataToSaveDto ecDataToSaveDto)
        {
            var finalResult = false;
            var ecdataToCreate = _mapper.Map<EcData>(ecDataToSaveDto);
            ecdataToCreate.InsertUserId = insertUserId;
            int inventOpTypeId = (int)InventOpType.TypeEnum.TabletData;

            using (var identityContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _repo.Add(ecdataToCreate);

                    var inventOp = new InventOp
                    {
                        InventOpTypeId = inventOpTypeId,
                        TabletId = ecDataToSaveDto.TabletId,
                        OpDate = ecDataToSaveDto.OpDate,
                        EcDataId = ecdataToCreate.Id
                    };
                    _repo.Add(inventOp);

                    if (await _repo.SaveAll())
                    {
                        finalResult = true;
                        identityContextTransaction.Commit();
                    }

                }
                catch (System.Exception)
                {
                    identityContextTransaction.Rollback();
                    finalResult = false;
                }
            }

            if (finalResult)
                return Ok();

            return BadRequest();
        }

        [HttpPost("SaveSdCard/{insertUserId}")]
        public async Task<IActionResult> SaveSdCard(int insertUserId, SdCardDto sdCardDto)
        {
            var finalResult = false;
            // var ecdataToCreate = _mapper.Map<EcData>(ecDataToSaveDto);
            var sdcardCreate = _mapper.Map<Sdcard>(sdCardDto);
            sdcardCreate.InsertUserId = insertUserId;
            int inventOpTypeId = (int)InventOpType.TypeEnum.Export;

            using (var identityContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _repo.Add(sdcardCreate);

                    foreach (var sdtab in sdCardDto.SdcardTablets)
                    {
                        var sdcardTabCreate = _mapper.Map<SdcardTablet>(sdtab);
                        sdcardTabCreate.SdcardId = sdcardCreate.Id;
                        _repo.Add(sdcardTabCreate);

                        var inventop = new InventOp
                        {
                            OpDate = sdtab.ExportDate,
                            TabletId = sdtab.TabletId,
                            SdcardId = sdcardCreate.Id,
                            InventOpTypeId = inventOpTypeId
                        };
                        _repo.Add(inventop);
                    }


                    if (await _repo.SaveAll())
                    {
                        finalResult = true;
                        identityContextTransaction.Commit();
                    }

                }
                catch (System.Exception)
                {
                    identityContextTransaction.Rollback();
                    finalResult = false;
                }
            }

            if (finalResult)
                return Ok();

            return BadRequest();
        }

        [HttpPost("DeletecData/{ecDataId}")]
        public async Task<IActionResult> DeletecData(int ecDataId)
        {
            var inventOp = await _context.InventOps.FirstOrDefaultAsync(a => a.EcDataId == ecDataId);
            if (inventOp != null)
            {
                _repo.Delete(inventOp);
                var eccdata = await _context.EcData.FirstOrDefaultAsync(b => b.Id == ecDataId);
                _repo.Delete(eccdata);

                if (await _repo.SaveAll())
                    return Ok();

                return BadRequest();
            }
            return NotFound();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////// P U T ///////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }


}