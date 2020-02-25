using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Account
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string AccountSite { get; set; }
        public int? AccountTypeId { get; set; }
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string Description { get; set; }
        public decimal Account1 { get; set; }
        public byte IsAccountActive { get; set; }
        public decimal CreditLine { get; set; }
        public bool IsTaxExempt { get; set; }
        public int? TimeZone { get; set; }
        public byte Active { get; set; }
        public bool Deleted { get; set; }
        public string LastIpaddress { get; set; }
        public DateTime? LastLoginDate { get; set; }

        public  AccountType AccountType { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryFromAccount { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryToAccount { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationFromAccount { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationToAccount { get; set; }
        // public  ICollection<SaleOrder> SaleOrder { get; set; }
    }
}
