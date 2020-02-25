using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class FinancialOperationCheque
    {
        public int Id { get; set; }
        public int FinancialOperationId { get; set; }
        public int ChequeId { get; set; }

        public  Cheque Cheque { get; set; }
        public  FinancialOperation FinancialOperation { get; set; }
    }
}
