using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class SdcardTablet
    {
        public int Id { get; set; }
        public int TabletId { get; set; }
        public int SdcardId { get; set; }
        public int? EnrolmentCenterId { get; set; }
        public int? OperatorId { get; set; }
        public int NumExport { get; set; }
        public int Cat1 { get; set; }
        public int Cat2 { get; set; }
        public int NistCat1 { get; set; }
        public int NistCat2 { get; set; }
        public DateTime ExportDate { get; set; }

        public  EnrolmentCenter EnrolmentCenter { get; set; }
        public  User Operator { get; set; }
        public  Sdcard Sdcard { get; set; }
        public  Tablet Tablet { get; set; }
    }
}
