using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Repair
    {


        public int Id { get; set; }
        public DateTime? RepairDate { get; set; }
        public int FromStoreId { get; set; }
        public int ToStoreId { get; set; }
        public int RepairTypeId { get; set; }
        public int? UserId { get; set; }

        public Store FromStore { get; set; }
        public RepairType RepairType { get; set; }
        public Store ToStore { get; set; }
        // public ICollection<RepairTablet> RepairTablet { get; set; }
    }
}
