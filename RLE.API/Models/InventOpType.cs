using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class InventOpType
    {
       
  public enum TypeEnum
        {
            StockEntry = 1,
            StockTransfer = 2,
            StockAllocation = 3,
            StockExchange = 4,
            Failure = 5,
            Export = 6,
            ToRepair = 7,
            FromRepair = 8,
            Maintenance = 9,
            TabletData = 10,
            InventOp = 11,
            EmpMvtToEC = 12,
            TabletCorrection = 13,
            EcMvt=14
        }
        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<InventOp> InventOp { get; set; }
        // public  ICollection<StockMvt> StockMvt { get; set; }
    }
}
