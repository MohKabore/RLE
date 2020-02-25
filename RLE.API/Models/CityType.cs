using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class CityType
    {
        public CityType()
        {
            // City = new HashSet<City>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<City> City { get; set; }
    }
}
