using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class RoleCapability
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int CapabilityId { get; set; }
        public int AccessFlag { get; set; }

        public  Capability Capability { get; set; }
        public  Role Role { get; set; }
    }
}
