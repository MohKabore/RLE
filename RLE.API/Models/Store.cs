using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Store
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? CityId { get; set; }
        public int? EmployeeId { get; set; }

        public  City City { get; set; }
        public  User Employee { get; set; }
        // public  ICollection<InventOp> InventOpFromStore { get; set; }
        // public  ICollection<InventOp> InventOpToStore { get; set; }
        // public  ICollection<Repair> RepairFromStore { get; set; }
        // public  ICollection<Repair> RepairToStore { get; set; }
        // public  ICollection<StockMvt> StockMvtFromStore { get; set; }
        // public  ICollection<StockMvt> StockMvtToStore { get; set; }
        // public  ICollection<Tablet> Tablet { get; set; }
    }
}
