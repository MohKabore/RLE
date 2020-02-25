using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class SoshipmentMethod
    {
        public int Id { get; set; }
        public decimal TaxRate { get; set; }
        public string Name { get; set; }
        public decimal DefaultCost { get; set; }
        public string Description { get; set; }
        public byte DisplaySequence { get; set; }

        // public  ICollection<SaleOrder> SaleOrder { get; set; }
    }
}
