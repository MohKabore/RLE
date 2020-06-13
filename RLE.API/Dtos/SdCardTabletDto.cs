using System;

namespace RLE.API.Dtos
{
    public class SdCardTabletDto
    {
        public int TabletId { get; set; }
        public int? SdcardId { get; set; }
        public int NumExport { get; set; }
        public int Cat1 { get; set; }
        public int Cat2 { get; set; }
        public int NistCat1 { get; set; }
        public int NistCat2 { get; set; }
        public DateTime ExportDate { get; set; }

    }
}