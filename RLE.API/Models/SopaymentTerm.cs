﻿using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class SopaymentTerm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Eom { get; set; }
        public short Days { get; set; }
        public bool Cash { get; set; }

        // public  ICollection<SaleOrder> SaleOrder { get; set; }
    }
}