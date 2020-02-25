using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class RepairTablet
    {
        public int Id { get; set; }
        public int RepairId { get; set; }
        public int TabletId { get; set; }
        public bool? TabletRepaired { get; set; }

        public  Repair Repair { get; set; }
        public  Tablet Tablet { get; set; }
    }
}
