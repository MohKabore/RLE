namespace RLE.API.Models
{
    public class TrainingClassCity
    {
          public int Id { get; set; }
        public int TrainingClassId { get; set; }
        public TrainingClass TrainingClass { get; set; }
        public City City { get; set; }
        public int CityId { get; set; }
        public int TotalTrained { get; set; }
    }
}