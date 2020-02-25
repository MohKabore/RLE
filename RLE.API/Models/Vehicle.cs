using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Vehicle
    {

        public int Id { get; set; }
        public int VehicleTypeId { get; set; }
        public int? EmployeeId { get; set; }
        public int? RegionId { get; set; }
        public string Model { get; set; }
        public double? Mileage { get; set; }
        public double? KmConsumption { get; set; }

        public  User Employee { get; set; }
        public  Region Region { get; set; }
        public  VehicleType VehicleNavigation { get; set; }
        // public  ICollection<VehicleFuel> VehicleFuel { get; set; }
    }
}
