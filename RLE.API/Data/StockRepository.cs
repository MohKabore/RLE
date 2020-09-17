using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RLE.API.Dtos;
using RLE.API.Models;

namespace RLE.API.Data
{
    public class StockRepository : IStockRepository
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        public StockRepository(DataContext context, IConfiguration config, UserManager<User> userManager, IMapper mapper)
        {
            _context = context;
            _config = config;
            _mapper = mapper;
            _config = config;
            _userManager = userManager;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public async void AddAsync<T>(T entity) where T : class
        {
            await _context.AddAsync(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public void DeleteAll<T>(List<T> entities) where T : class
        {
            _context.RemoveRange(entities);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Tablet>> MaintainairTablets(int maintenairId)
        {
            var tablets = await _context.Tablets.Include(s => s.Store).Where(s => s.Store.EmployeeId == maintenairId)
                                                     .OrderBy(a => a.Imei).ToListAsync();
            return tablets;
        }


        public async Task StockAllocation(int insertUserId,int tabletTypeId, StockAllocationDto stockAllocationDto)
        {
            int ToStoreId = Convert.ToInt32(stockAllocationDto.ToStoreId);
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
                        Name = "MAG CEI - " + (await _context.Departments.FirstOrDefaultAsync(a => a.Id == Convert.ToInt32(stockAllocationDto.DepartmentId))).Name,
                        RegionId = stockAllocationDto.RegionId,
                        DepartmentId = stockAllocationDto.DepartmentId
                    };
                    Add(newStore);
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
                InsertUserId = insertUserId,
                ToStoreId = ToStoreId,
                FromStoreId = stockAllocationDto.FromStoreId,
                MvtDate = stockAllocationDto.Mvtdate,
                RefNum = stockAllocationDto.RefNum,
                InventOpTypeId = inventOpTypeId
            };
            Add(stckMvt);

            foreach (var imei in stockAllocationDto.Imeis)
            {
                var tablet = new Tablet
                {
                    Imei = imei,
                    StoreId = ToStoreId,
                    Type = false,
                    Status = 1,
                    Active = false,
                    TabletTypeId = tabletTypeId,
                    RepairCounter=0
                };
                Add(tablet);

                var inventOp = new InventOp
                {
                    InsertUserId = insertUserId,
                    FormNum = stockAllocationDto.RefNum,
                    OpDate = stockAllocationDto.Mvtdate,
                    FromStoreId = stockAllocationDto.FromStoreId,
                    ToStoreId = ToStoreId,
                    TabletId = tablet.Id,
                    InventOpTypeId = inventOpTypeId
                };
                Add(inventOp);

                var stkMvtinventOp = new StockMvtInventOp
                {
                    StockMvtId = stckMvt.Id,
                    InventOpId = inventOp.Id
                };
                Add(stkMvtinventOp);
            }
        }

        public async Task<IEnumerable<Tablet>> StoreTablets(int storeId)
        {
            var tablets = await _context.Tablets.Where(s => s.StoreId == storeId)
                                                 .OrderBy(a => a.Imei).ToListAsync();
            return tablets;
        }

        public void TabletAllocation(int insertUserId, StockAllocationDto stockAllocationDto)
        {
             int inventOpTypeId = (int)InventOpType.TypeEnum.StockTransfer;
            var stckMvt = new StockMvt
            {
                ToStoreId = stockAllocationDto.ToStoreId,
                FromStoreId = stockAllocationDto.FromStoreId,
                MvtDate = stockAllocationDto.Mvtdate,
                InsertUserId = insertUserId,
                RefNum = stockAllocationDto.RefNum,
                InventOpTypeId = inventOpTypeId
            };
            Add(stckMvt);

            foreach (var tablet in stockAllocationDto.Tablets)
            {
                tablet.StoreId = stockAllocationDto.ToStoreId;
                Update(tablet);

                var inventOp = new InventOp
                {
                    InsertUserId = insertUserId,
                    FormNum = stockAllocationDto.RefNum,
                    OpDate = stockAllocationDto.Mvtdate,
                    FromStoreId = stockAllocationDto.FromStoreId,
                    ToStoreId = stockAllocationDto.ToStoreId,
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
        }

        public async Task<List<Tablet>> GetTabletByImei(string imei)
        {
            var tablets = await _context.Tablets.Include(a=>a.TabletType)
                                                .Include(a=>a.Store).
                                                ThenInclude(a=>a.Employee)
                                                .ThenInclude(a=>a.Region)
                                                .Where(a=>a.Imei == imei)
                                                .ToListAsync();
            return tablets;

        }
    }
}