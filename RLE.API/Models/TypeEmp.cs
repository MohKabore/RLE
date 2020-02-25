using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class TypeEmp
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public byte WebHired { get; set; }

        // public  ICollection<User> Employee { get; set; }
    }
}
