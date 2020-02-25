using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class CashDeskCheque
    {
        public int Id { get; set; }
        public int CashDeskId { get; set; }
        public int ChequeId { get; set; }

        public  CashDesk CashDesk { get; set; }
        public  Cheque Cheque { get; set; }
    }
}
