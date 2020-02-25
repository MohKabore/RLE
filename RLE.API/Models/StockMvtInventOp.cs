using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class StockMvtInventOp
    {
        public int Id { get; set; }
        public int StockMvtId { get; set; }
        public int InventOpId { get; set; }

        public  InventOp InventOp { get; set; }
        public  StockMvt StockMvt { get; set; }
    }
}
