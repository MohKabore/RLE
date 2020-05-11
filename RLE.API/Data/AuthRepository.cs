using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using RLE.API.Models;

namespace RLE.API.Data {
    public class AuthRepository : IAuthRepository {
        private readonly DataContext _context;
        // private readonly IRleRepository _RLERepo;
        private readonly IConfiguration _config;

        public AuthRepository (DataContext context, IConfiguration config) {
            _context = context;
            // _RLERepo = RLERepo;
            _config = config;
        }
        public async Task<User> Login (string username, string password) {
            var user = await _context.Users.FirstOrDefaultAsync (x => x.UserName == username);

            if (user == null)
                return null;

            // if(!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            // return null;

            return user;
        }

        private bool VerifyPasswordHash (string password, byte[] passwordHash, byte[] passwordSalt) {
            using (var hmac = new System.Security.Cryptography.HMACSHA512 (passwordSalt)) {
                var computedHash = hmac.ComputeHash (System.Text.Encoding.UTF8.GetBytes (password));
                for (int i = 0; i < computedHash.Length; i++) {
                    if (computedHash[i] != passwordHash[i]) return false;
                }
            }
            return true;
        }

        public async Task<User> Register (User user, string password) {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash (password, out passwordHash, out passwordSalt);

            // user.PasswordHash = passwordHash;
            // user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync (user);
            await _context.SaveChangesAsync ();

            return user;
        }

        private void CreatePasswordHash (string password, out byte[] passwordHash, out byte[] passwordSalt) {
            using (var hmac = new System.Security.Cryptography.HMACSHA512 ()) {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash (System.Text.Encoding.UTF8.GetBytes (password));
            }
        }

        public async Task<bool> UserExists (string username) {
            if (await _context.Users.AnyAsync (x => x.UserName == username))
                return true;

            return false;
        }

        public async Task<User> GetUserById (int id) {
            return await _context.Users.FirstOrDefaultAsync (u => u.Id == id);
        }

        public async Task<bool> SaveAll () {
            return await _context.SaveChangesAsync () > 0;
        }
    }
}