using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Bank
    {
        public Bank()
        {
            // BankAccount = new HashSet<BankAccount>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Url { get; set; }
        public string ContactFirstName { get; set; }
        public string ContactLastName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactCell { get; set; }

        // public  ICollection<BankAccount> BankAccount { get; set; }
    }
}
