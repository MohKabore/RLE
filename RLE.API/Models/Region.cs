using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Region
    {
        

        public int Id { get; set; }
        public string Name { get; set; }
        public int? DistrictId { get; set; }
        public string Code { get; set; }
        public byte Active { get; set; }
        public bool ActiveforInscription { get; set; }

        public  District District { get; set; }
        public virtual ICollection<Department> Departments { get; set; }
        // public virtual  ICollection<User> Employee { get; set; }
        // public virtual ICollection<Training> Training { get; set; }
        // public virtual ICollection<TrainingClass> TrainingClass { get; set; }
        // public  ICollection<Vehicle> Vehicle { get; set; }
    }
}
