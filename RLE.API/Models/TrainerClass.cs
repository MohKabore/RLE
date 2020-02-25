using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class TrainerClass
    {
        public int Id { get; set; }
        public int TrainerId { get; set; }
        public int TrainingClassId { get; set; }

        public  User Trainer { get; set; }
        public  TrainingClass TrainingClass { get; set; }
    }
}
