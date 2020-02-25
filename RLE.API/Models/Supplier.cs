using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Supplier
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Cell { get; set; }
        public string Password { get; set; }
        public decimal AuthorizedCreditLine { get; set; }
        public byte CreditLineActive { get; set; }
        public int NbDaysToPay { get; set; }
        public int? TimeZone { get; set; }
        public byte Active { get; set; }
        public bool Deleted { get; set; }
        public string LastIpaddr { get; set; }
        public DateTime? LastLoginDate { get; set; }

        // public  ICollection<FinOpHistory> FinOpHistoryFromSupplier { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryToSupplier { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationFromSupplier { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationToSupplier { get; set; }
        // public  ICollection<PurchaseOrder> PurchaseOrder { get; set; }
    }
}
