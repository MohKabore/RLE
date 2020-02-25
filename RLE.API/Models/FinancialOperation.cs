using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class FinancialOperation
    {
       
        public int Id { get; set; }
        public Guid? UserId { get; set; }
        public int FinOpTypeId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? SaleOrderId { get; set; }
        public int? PaymentTypeId { get; set; }
        public int? InvoiceId { get; set; }
        public int? ExpenseId { get; set; }
        public int? CashInId { get; set; }
        public decimal Amount { get; set; }
        public int? FromCashDeskId { get; set; }
        public int? FromBankAccountId { get; set; }
        public int? FromSupplierId { get; set; }
        public int? FromAccountId { get; set; }
        public int? ToCashDeskId { get; set; }
        public int? ToBankAccountId { get; set; }
        public int? ToSupplierId { get; set; }
        public int? ToAccountId { get; set; }
        public DateTime OpDate { get; set; }
        public string Notes { get; set; }
        public string FormNum { get; set; }
        public byte Status { get; set; }
        public byte AllocateStatus { get; set; }

        public  CashIn CashIn { get; set; }
        public  Expense Expense { get; set; }
        public  FinOpType FinOpType { get; set; }
        public  Account FromAccount { get; set; }
        public  BankAccount FromBankAccount { get; set; }
        public  CashDesk FromCashDesk { get; set; }
        public  Supplier FromSupplier { get; set; }
        public  Invoice Invoice { get; set; }
        public  PaymentType PaymentType { get; set; }
        public  PurchaseOrder PurchaseOrder { get; set; }
        public  SaleOrder SaleOrder { get; set; }
        public  Account ToAccount { get; set; }
        public  BankAccount ToBankAccount { get; set; }
        public  CashDesk ToCashDesk { get; set; }
        public  Supplier ToSupplier { get; set; }
        // public  ICollection<FinOpHistory> FinOpHistory { get; set; }
        // public  ICollection<FinancialOperationCheque> FinancialOperationCheque { get; set; }
    }
}
