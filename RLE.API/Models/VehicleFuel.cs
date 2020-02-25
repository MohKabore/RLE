using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class VehicleFuel
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public int Fueld { get; set; }
        public double? Mileage { get; set; }

        public  Fuel FueldNavigation { get; set; }
        public  Vehicle Vehicle { get; set; }
    }
}
