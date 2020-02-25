using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Country
    {
        public Country()
        {
            // Address = new HashSet<Address>();
            // Employee = new HashSet<User>();
            // StateProvince = new HashSet<StateProvince>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<Address> Address { get; set; }
        // public  ICollection<User> Employee { get; set; }
        // public  ICollection<StateProvince> StateProvince { get; set; }
    }
}
