using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class RepairAction
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<Failure> FailureRepairAction1 { get; set; }
        // public  ICollection<Failure> FailureRepairAction2 { get; set; }
    }
}
