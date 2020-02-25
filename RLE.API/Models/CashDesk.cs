using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class CashDesk
    {
        public CashDesk()
        {
            // CashDeskCheque = new HashSet<CashDeskCheque>();
            // FinOpHistoryFromCashDesk = new HashSet<FinOpHistory>();
            // FinOpHistoryToCashDesk = new HashSet<FinOpHistory>();
            // FinancialOperationFromCashDesk = new HashSet<FinancialOperation>();
            // FinancialOperationToCashDesk = new HashSet<FinancialOperation>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public int? AddressId { get; set; }
        public string Name { get; set; }
        public decimal CashAmount { get; set; }
        public decimal AmountInChq { get; set; }
        public decimal CashOut { get; set; }
        public decimal CashIn { get; set; }

        // public  ICollection<CashDeskCheque> CashDeskCheque { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryFromCashDesk { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryToCashDesk { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationFromCashDesk { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationToCashDesk { get; set; }
    }
}
