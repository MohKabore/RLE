using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class PaymentType
    {
        
        public int Id { get; set; }
        public string Name { get; set; }

        // public  ICollection<FinancialOperation> FinancialOperation { get; set; }
    }
}
