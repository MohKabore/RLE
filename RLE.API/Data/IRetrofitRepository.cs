using System.Collections.Generic;
using System.Threading.Tasks;

namespace RLE.API.Data
{
    public interface IRetrofitRepository
    {
            void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        void DeleteAll<T>(List<T> entities) where T : class;
        Task<bool> SaveAll();
    }
}