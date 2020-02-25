using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class InventOpType
    {
       

        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<InventOp> InventOp { get; set; }
        // public  ICollection<StockMvt> StockMvt { get; set; }
    }
}
