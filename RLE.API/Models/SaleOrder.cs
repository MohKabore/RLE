using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class SaleOrder
    {

        public int Id { get; set; }
        public int? AccountId { get; set; }
        public int SopaymentTermId { get; set; }
        public int SoshipmentMethodId { get; set; }
        public DateTime Sodate { get; set; }
        public int? BillingAddrId { get; set; }
        public int? ShippingAddrId { get; set; }
        public decimal SubTotalExclTax { get; set; }
        public decimal DiscountExclTax { get; set; }
        public decimal ShippingChargeExclTax { get; set; }
        public decimal ShippingChargeInclTax { get; set; }
        public decimal TaxCharge { get; set; }
        public decimal Sodiscount { get; set; }
        public decimal Adjustment { get; set; }
        public decimal SaleCommission { get; set; }
        public DateTime? DueDate { get; set; }
        public int NetDays { get; set; }
        public decimal DownPayment { get; set; }
        public int DaysEom { get; set; }
        public decimal DiscountEom { get; set; }
        public int NbPayEom { get; set; }
        public int NbPayPeriod { get; set; }
        public int Period { get; set; }
        public bool InvoiceEachDelivery { get; set; }
        public byte OrderStatus { get; set; }
        public byte Cancelled { get; set; }
        public string Notes { get; set; }

        public  Account Account { get; set; }
        public  Address BillingAddr { get; set; }
        public  Address ShippingAddr { get; set; }
        public  SopaymentTerm SopaymentTerm { get; set; }
        public  SoshipmentMethod SoshipmentMethod { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperation { get; set; }
    }
}
