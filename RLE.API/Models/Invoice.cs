using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Invoice
    {

        public int Id { get; set; }
        public int InvoiceTypeId { get; set; }
        public int? ConditionId { get; set; }
        public int? LatePaymentChargeId { get; set; }
        public int Counter { get; set; }
        public string Number { get; set; }
        public string Ponum { get; set; }
        public decimal AmountHt { get; set; }
        public decimal AmountTtc { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxRate { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public byte Status { get; set; }
        public string Remark { get; set; }
        public bool ToBeSentByMail { get; set; }

        public  InvoiceType InvoiceType { get; set; }
        // public  ICollection<CashIn> CashIn { get; set; }
        // public  ICollection<Expense> Expense { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperation { get; set; }
    }
}
