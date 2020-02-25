using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class AccountType
    {
        public AccountType()
        {
            // Account = new HashSet<Account>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<Account> Account { get; set; }
    }
}
