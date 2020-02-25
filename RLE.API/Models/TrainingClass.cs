using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class TrainingClass
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public int? RegionId { get; set; }
        public int? DepartmentId { get; set; }
        public int? CityId { get; set; }
        public int? MunicipalityId { get; set; }
        public int TrainingId { get; set; }
        public DateTime? EtastartDate { get; set; }
        public DateTime? EtaendDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public byte Status { get; set; }
        public byte Active { get; set; }

        public  City City { get; set; }
        public  Department Department { get; set; }
        public  Municipality Municipality { get; set; }
        public  Region Region { get; set; }
        public  Training Training { get; set; }
        // public  ICollection<TrainerClass> TrainerClass { get; set; }
    }
}
