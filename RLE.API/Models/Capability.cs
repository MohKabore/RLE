using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Capability
    {
        public Capability()
        {
            // RoleCapability = new HashSet<RoleCapability>();
        }

        public int Id { get; set; }
        public int? MenuItemId { get; set; }
        public string Name { get; set; }
        public int AccessType { get; set; }

        public  MenuItem MenuItem { get; set; }
        // public  ICollection<RoleCapability> RoleCapability { get; set; }
    }
}
