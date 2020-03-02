using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class TrainingClassDetailDto
    {
        public TrainingClassDetailDto()
        {
            TotalParticipants = 0;
            TotalTrainers = 0;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public int? RegionId { get; set; }
        public string RegionName { get; set; }
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public byte Status { get; set; }
        public bool Active { get; set; }
        public int? CityId { get; set; }
        public string CityName { get; set; }
        public int TrainingId { get; set; }
        public string StartDate { get; set; }
        public List<int> TrainerIds { get; set; }
        public string EndDate { get; set; }
        public int TotalParticipants { get; set; }
        public List<UserForListDto> Participants { get; set; }
        public int TotalTrainers { get; set; }
        public List<UserForListDto> Trainers { get; set; }

    }
}