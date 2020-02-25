using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class InventOp
    {
      

        public int Id { get; set; }
        public int TabletId { get; set; }
        public int? TabletExId { get; set; }
        public int? InventOpTypeId { get; set; }
        public DateTime OpDate { get; set; }
        public int? FromStoreId { get; set; }
        public int? FromEmployeeId { get; set; }
        public int? ToStoreId { get; set; }
        public int? ToEmployeeId { get; set; }
        public int? FailureId { get; set; }
        public int? EnrolmentCenterId { get; set; }
        public int? SdcardId { get; set; }
        public string FormNum { get; set; }
        public byte Status { get; set; }
        public DateTime InsertDate { get; set; }

        public  EnrolmentCenter EnrolmentCenter { get; set; }
        public  Failure Failure { get; set; }
        public  User FromEmployee { get; set; }
        public  Store FromStore { get; set; }
        public  InventOpType InventOpType { get; set; }
        public  Sdcard Sdcard { get; set; }
        public  Tablet Tablet { get; set; }
        public  Tablet TabletEx { get; set; }
        public  User ToEmployee { get; set; }
        public  Store ToStore { get; set; }
        // public  ICollection<StockMvtInventOp> StockMvtInventOp { get; set; }
    }
}
