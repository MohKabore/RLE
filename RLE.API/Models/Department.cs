using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Department
    {
        
        public int Id { get; set; }
        public string Name { get; set; }
        public int? RegionId { get; set; }
        public string Code { get; set; }
        public byte Active { get; set; }
        public bool ActiveforInscription { get; set; }

        public  Region Region { get; set; }
        public virtual  ICollection<City> Cities { get; set; }
        // public  ICollection<User> Employee { get; set; }
        // public  ICollection<TrainingClass> TrainingClass { get; set; }
    }
}
