using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class EnrolmentCenter
    {
        public EnrolmentCenter()
        {
            // Ecdeployment = new HashSet<Ecdeployment>();
            // Employee = new HashSet<User>();
            // InventOp = new HashSet<InventOp>();
            // SdcardTablet = new HashSet<SdcardTablet>();
        }

        public int Id { get; set; }
        public int? MunicipalityId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public  Municipality Municipality { get; set; }
        // public  ICollection<Ecdeployment> Ecdeployment { get; set; }
        // public  ICollection<User> Employee { get; set; }
        // public  ICollection<InventOp> InventOp { get; set; }
        // public  ICollection<SdcardTablet> SdcardTablet { get; set; }
    }
}
