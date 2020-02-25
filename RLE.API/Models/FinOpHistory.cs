using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class FinOpHistory
    {
        public int Id { get; set; }
        public int FinancialOperationId { get; set; }
        public Guid? UserId { get; set; }
        public int FinOpTypeId { get; set; }
        public DateTime Opdate { get; set; }
        public int? FromCashDeskId { get; set; }
        public int? FromBankAccountId { get; set; }
        public int? FromSupplierId { get; set; }
        public int? FromAccountId { get; set; }
        public int? ToCashDeskId { get; set; }
        public int? ToBankAccountId { get; set; }
        public int? ToSupplierId { get; set; }
        public int? ToAccountId { get; set; }
        public decimal AmountOld { get; set; }
        public decimal AmountNew { get; set; }
        public decimal AmountDelta { get; set; }
        public DateTime InsertDate { get; set; }

        public  FinOpType FinOpType { get; set; }
        public  FinancialOperation FinancialOperation { get; set; }
        public  Account FromAccount { get; set; }
        public  BankAccount FromBankAccount { get; set; }
        public  CashDesk FromCashDesk { get; set; }
        public  Supplier FromSupplier { get; set; }
        public  Account ToAccount { get; set; }
        public  BankAccount ToBankAccount { get; set; }
        public  CashDesk ToCashDesk { get; set; }
        public  Supplier ToSupplier { get; set; }
    }
}
