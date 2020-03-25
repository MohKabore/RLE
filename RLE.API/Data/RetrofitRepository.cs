using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper.Configuration;

namespace RLE.API.Data
{
    public class RetrofitRepository : IRetrofitRepository
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        public RetrofitRepository(DataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;

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
    }
}