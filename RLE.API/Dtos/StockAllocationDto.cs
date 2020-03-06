using System;
using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class StockAllocationDto
    {
        public int FromStoreId { get; set; }
        public int ToStoreId { get; set; }
        public int? RegionId { get; set; }
        public int? DepartmentId { get; set; }
        public DateTime  Mvtdate{ get; set; }
        public string RefNum { get; set; }
        public List<string> Imeis{ get; set; }
    }
}