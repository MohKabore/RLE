using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Fuel
    {
  

        public int Id { get; set; }
        public DateTime? RefillDate { get; set; }
        public double? Amount { get; set; }

    }
}
