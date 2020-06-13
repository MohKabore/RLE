using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Sdcard
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int? ExportId { get; set; }
        public string Sdnum { get; set; }
        public bool FullExport { get; set; }
        public byte Status { get; set; }
        public User Employee { get; set; }
        public Export Export { get; set; }
        public int RegionId { get; set; }
        public Region Region { get; set; }
        public int InsertUserId { get; set; }
        // public  ICollection<InventOp> InventOp { get; set; }
        public  ICollection<SdcardTablet> SdcardTablets { get; set; }
    }
}
