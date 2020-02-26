using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class TrainingDetailDto
    {
        public TrainingDetailDto()
        {
            TotalTrainers = 0;
            TotalParticipants = 0;
            TotalClasses = 0;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string RegionName { get; set; }
        public int RegionId { get; set; }
        public string Description { get; set; }
        public int TotalTrainers { get; set; }
        public int TotalClasses { get; set; } 
        public int TotalParticipants { get; set; } 

        public List<TrainingClassDetailDto> TrainingClasses { get; set; }
    }
}