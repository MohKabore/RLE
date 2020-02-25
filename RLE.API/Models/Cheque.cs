using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Cheque
    {
        

        public int Id { get; set; }
        public int BankAccountId { get; set; }
        public string Num { get; set; }
        public DateTime? DateCheque { get; set; }
        public decimal Amount { get; set; }
        public byte Status { get; set; }

        public  BankAccount BankAccount { get; set; }
        // public  ICollection<CashDeskCheque> CashDeskCheque { get; set; }
        // public  ICollection<FinancialOperationCheque> FinancialOperationCheque { get; set; }
    }
}
