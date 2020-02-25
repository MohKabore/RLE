using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Tax
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Value { get; set; }

        // public  ICollection<CashIn> CashIn { get; set; }
        // public  ICollection<Expense> Expense { get; set; }
    }
}
