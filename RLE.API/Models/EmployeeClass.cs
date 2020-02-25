using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class EmployeeClass
    {
        public int Id { get; set; }
        public int TrainingClassId { get; set; }
        public TrainingClass TrainingClass { get; set; }
        public int EmployeeId { get; set; }
        public User Employee { get; set; }
    }
}
