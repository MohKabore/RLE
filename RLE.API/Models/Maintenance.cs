using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Maintenance
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public bool? Exchanged { get; set; }
        public int? FailureId { get; set; }
        public int? TabletId { get; set; }
        public string Note { get; set; }

        public  Tablet Tablet { get; set; }
    }
}
