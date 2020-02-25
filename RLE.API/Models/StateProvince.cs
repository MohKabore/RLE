using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class StateProvince
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string Name { get; set; }
        public string Abbreviation { get; set; }
        public bool? Published { get; set; }
        public int DisplaySequence { get; set; }

        public  Country Country { get; set; }
        // public  ICollection<Address> Address { get; set; }
    }
}
