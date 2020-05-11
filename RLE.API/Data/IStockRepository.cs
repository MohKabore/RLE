using System.Collections.Generic;
using System.Threading.Tasks;
using RLE.API.Dtos;
using RLE.API.Models;

namespace RLE.API.Data
{
    public interface IStockRepository
    {
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        void DeleteAll<T>(List<T> entities) where T : class;
        Task<bool> SaveAll();
        Task<IEnumerable<Tablet>> MaintainairTablets(int maintenairId);
        Task<IEnumerable<Tablet>> StoreTablets(int storeId);
        Task StockAllocation(int insertUserId, StockAllocationDto stockAllocationDto);
        void TabletAllocation(int insertUserId, StockAllocationDto stockAllocationDto);
    }
}