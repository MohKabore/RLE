using System;
using System.Collections.Generic;
using RLE.API.Models;

namespace RLE.API.Dtos
{
    public class StockAllocationDto
    {
        public int? FromStoreId { get; set; }
        public int? ToStoreId { get; set; }
        public int? FromEmployeeId { get; set; }
        public int? ToEmployeeId { get; set; }
        public int? RegionId { get; set; }
        public int? DepartmentId { get; set; }
        public DateTime  Mvtdate{ get; set; }
        public string RefNum { get; set; }
        public List<string> Imeis{ get; set; }
        public List<Tablet> Tablets { get; set; }
        public List<int> TabletIds { get; set; }
    }
}