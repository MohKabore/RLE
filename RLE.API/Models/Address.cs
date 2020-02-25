using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Address
    {
        public Address()
        {
            // PurchaseOrderBillingAddr = new HashSet<PurchaseOrder>();
            // PurchaseOrderShippingAddr = new HashSet<PurchaseOrder>();
            // SaleOrderBillingAddr = new HashSet<SaleOrder>();
            // SaleOrderShippingAddr = new HashSet<SaleOrder>();
        }

        public int Id { get; set; }
        public string AddressTitle { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Pobox { get; set; }
        public int? DistrictId { get; set; }
        public int? CityId { get; set; }
        public string ProvinceTerritory { get; set; }
        public int? StateProvinceId { get; set; }
        public int? CountryId { get; set; }
        public string PostalCode { get; set; }
        public string Fax { get; set; }
        public string Phone { get; set; }
        public bool IsDefault { get; set; }
        public bool Deleted { get; set; }

        public  City City { get; set; }
        public  Country Country { get; set; }
        public  District District { get; set; }
        public  StateProvince StateProvince { get; set; }
        // public  ICollection<PurchaseOrder> PurchaseOrderBillingAddr { get; set; }
        // public  ICollection<PurchaseOrder> PurchaseOrderShippingAddr { get; set; }
        // public  ICollection<SaleOrder> SaleOrderBillingAddr { get; set; }
        // public  ICollection<SaleOrder> SaleOrderShippingAddr { get; set; }
    }
}
