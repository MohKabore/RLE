using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class VehicleType
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public  Vehicle Vehicle { get; set; }
    }
}
