using System;
using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class TrainingClassCreationDto
    {
        public TrainingClassCreationDto()
        {
               Active = 1;
                Status = 0;
        }
        public string Name { get; set; }
        public int? RegionId { get; set; }
        public int SessionId { get; set; }
        public int? DepartmentId { get; set; }
        public int? CityId { get; set; }
        public int? MunicipalityId { get; set; }
        public int TrainingId { get; set; }
        public List<int> TrainerIds { get; set; }
        public List<int> CityIds { get; set; }
        // public DateTime? StartDate { get; set; }
        // public DateTime? EndDate { get; set; }
        public byte Status { get; set; }
        public byte Active { get; set; }
    }
}