using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Circuit
    {
        public Circuit()
        {
            // CityCircuit = new HashSet<CityCircuit>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? StartingCityId { get; set; }

        public  City StartingCity { get; set; }
        // public  ICollection<CityCircuit> CityCircuit { get; set; }
    }
}
