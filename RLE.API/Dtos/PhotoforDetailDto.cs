using System;

namespace RLE.API.Dtos
{
    public class PhotoforDetailDto
    {
         public int Id { get; set; }
         public string Url { get; set; }
        public int? TrainingClassId { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public bool IsApproved { get; set; }
    }
}