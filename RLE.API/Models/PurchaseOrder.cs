using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class PurchaseOrder
    {


        public int Id { get; set; }
        public DateTime Podate { get; set; }
        public int? PoshipmentMethodId { get; set; }
        public int PaymentTermId { get; set; }
        public int SupplierId { get; set; }
        public int? BillingAddrId { get; set; }
        public int? ShippingAddrId { get; set; }
        public decimal SubtotalExclTax { get; set; }
        public decimal DiscountExclTax { get; set; }
        public decimal ShippingChargeExclTax { get; set; }
        public decimal ShippingChargeInclTax { get; set; }
        public decimal TaxCharge { get; set; }
        public decimal Podiscount { get; set; }
        public decimal Adjustment { get; set; }
        public decimal SaleCommission { get; set; }
        public DateTime? DueDate { get; set; }
        public int NetDays { get; set; }
        public decimal DownPayment { get; set; }
        public int DaysEom { get; set; }
        public decimal DiscountEom { get; set; }
        public int DiscountDaysEom { get; set; }
        public bool PayEachDelivery { get; set; }
        public bool PayAtDeliveryOk { get; set; }
        public byte OrderStatus { get; set; }
        public byte Cancelled { get; set; }
        public string Notes { get; set; }

        public Address BillingAddr { get; set; }
        public PaymentTerm PaymentTerm { get; set; }
        public PoshipmentMethod PoshipmentMethod { get; set; }
        public Address ShippingAddr { get; set; }
        public Supplier Supplier { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperation { get; set; }
    }
}
