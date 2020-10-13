using System;

namespace RLE.API.Dtos
{
    public class TrainingForUpdateDto
    {
         public string Name { get; set; }
        public string Description { get; set; }
        public DateTime TrainingDate { get; set; }
    }
}