using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class CashIn
    {
        public CashIn()
        {
            // FinancialOperation = new HashSet<FinancialOperation>();
        }

        public int Id { get; set; }
        public int CashInTypeId { get; set; }
        public int? InvoiceId { get; set; }
        public int? TaxeId { get; set; }
        public DateTime CashInDate { get; set; }
        public bool PriceWithTax { get; set; }
        public decimal Amount { get; set; }
        public string NumRef { get; set; }
        public string Note { get; set; }
        public byte Status { get; set; }
        public string ReceiptPath { get; set; }
        public byte Active { get; set; }

        public  CashInType CashInType { get; set; }
        public  Invoice Invoice { get; set; }
        public  Tax Taxe { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperation { get; set; }
    }
}
