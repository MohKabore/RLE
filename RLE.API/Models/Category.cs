using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Category
    {
        public Category()
        {
            // Expense = new HashSet<Expense>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int DsplSeq { get; set; }

        // public  ICollection<Expense> Expense { get; set; }
    }
}
