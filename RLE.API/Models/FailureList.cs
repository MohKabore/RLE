using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class FailureList
    {

        public int Id { get; set; }
        public int? FailureGroupId { get; set; }
        public string Name { get; set; }

        public  FailureGroup FailureGroup { get; set; }
        // public  ICollection<Failure> FailureFailureList1 { get; set; }
        // public  ICollection<Failure> FailureFailureList2 { get; set; }
    }
}
