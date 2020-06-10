using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Store
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? RegionId { get; set; }
        public Region Region { get; set; }
        public int? DepartmentId { get; set; }
        public Department Department { get; set; }
        public int? CityId { get; set; }
        public int? EmployeeId { get; set; }

        public  City City { get; set; }
        public  User Employee { get; set; }
        public int StoreTypeId { get; set; }
        public StoreType StoreType { get; set; }
        public int?  StorePId { get; set; }
        public Store    StoreP { get; set; }
        // public  ICollection<InventOp> InventOpFromStore { get; set; }
        // public  ICollection<InventOp> InventOpToStore { get; set; }
        // public  ICollection<Repair> RepairFromStore { get; set; }
        // public  ICollection<Repair> RepairToStore { get; set; }
        // public  ICollection<StockMvt> StockMvtFromStore { get; set; }
        // public  ICollection<StockMvt> StockMvtToStore { get; set; }
        public  ICollection<Tablet> Tablets { get; set; }
    }
}
