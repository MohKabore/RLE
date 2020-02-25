using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Training
    {

        public int Id { get; set; }
        public int? RegionId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public byte Status { get; set; }
        public byte Active { get; set; }

        public  Region Region { get; set; }
        public  ICollection<TrainingClass> TrainingClasses { get; set; }
    }
}
