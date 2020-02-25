using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class District
    {
        public District()
        {
            // Address = new HashSet<Address>();
            // Region = new HashSet<Region>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<Address> Address { get; set; }
        public virtual  ICollection<Region> Regions { get; set; }
    }
}
