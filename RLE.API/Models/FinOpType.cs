using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class FinOpType
    {
               public int Id { get; set; }
        public string Name { get; set; }
        public bool? InOut { get; set; }

        public  ICollection<FinOpHistory> FinOpHistory { get; set; }
        // public  ICollection<FinancialOperation> FinancialOperation { get; set; }
    }
}
