using System;

namespace RLE.API.Dtos
{
    public class TrainingCreationDto
    {
        public TrainingCreationDto()
        {
                Active = 1;
                Status = 0;
        }
        public string Name { get; set; }
        public string Description { get; set; }
        public int RegionId { get; set; }
        public DateTime TrainingDate { get; set; }
         public byte Status { get; set; }
        public byte Active { get; set; }
    }
}