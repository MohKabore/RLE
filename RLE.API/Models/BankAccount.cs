using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class BankAccount
    {
        public BankAccount()
        {
            // Cheque = new HashSet<Cheque>();
            // FinOpHistoryFromBankAccount = new HashSet<FinOpHistory>();
            // FinOpHistoryToBankAccount = new HashSet<FinOpHistory>();
            // FinancialOperationFromBankAccount = new HashSet<FinancialOperation>();
            // FinancialOperationToBankAccount = new HashSet<FinancialOperation>();
        }

        public int Id { get; set; }
        public int BankId { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public decimal ToBeSigned { get; set; }
        public decimal ChequesOut { get; set; }
        public decimal ChequesIn { get; set; }
        public decimal CreditLine { get; set; }
        public byte CreditLineActive { get; set; }

        public  Bank Bank { get; set; }
        public  ICollection<Cheque> Cheque { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryFromBankAccount { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistoryToBankAccount { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationFromBankAccount { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperationToBankAccount { get; set; }
    }
}
