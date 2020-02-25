using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class MenuItem
    {

        public int Id { get; set; }
        public int? MenuItemIdP { get; set; }
        public string MenuItemName { get; set; }
        public string DisplayName { get; set; }
        public string Url { get; set; }
        public bool IsAlwaysEnabled { get; set; }
        public short DsplSeq { get; set; }

        public  MenuItem MenuItemIdPNavigation { get; set; }
        // public  ICollection<Capability> Capability { get; set; }
        // public  ICollection<MenuItem> InverseMenuItemIdPNavigation { get; set; }
    }
}
