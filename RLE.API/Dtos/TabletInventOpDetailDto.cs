using System;

namespace RLE.API.Dtos
{
    public class TabletInventOpDetailDto
    {
        public string Type { get; set; }
        public DateTime OpDate { get; set; }
        public string Details { get; set; }
        public int? InsertUserId { get; set; }
        public int? EcDataId { get; set; }
        public int? InventOpTypeId { get; set; }
    }
}