using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Failure
    {

        public int Id { get; set; }
        public string Ticket { get; set; }
        // public int TabletId { get; set; }
        public int? TabletExId { get; set; }
        // public int FailureList1Id { get; set; }
        // public int? FailureList2Id { get; set; }
        // public int? Hotliner1Id { get; set; }
        // public int? Hotliner2Id { get; set; }
        // public int? FieldTech1Id { get; set; }
        // public int? FieldTech2Id { get; set; }
        // public int? RepairAction1Id { get; set; }
        // public int? RepairAction2Id { get; set; }
        public DateTime FailureDate { get; set; }
        public DateTime? MaintDate { get; set; }
        public byte Repaired { get; set; }
        public bool SentToRepair { get; set; }
        public string Note1 { get; set; }
        public string Note2 { get; set; }
        public Guid User1Id { get; set; }
        public Guid? User2Id { get; set; }
        public DateTime InsertDate { get; set; }

        // public  FailureList FailureList1 { get; set; }
        // public  FailureList FailureList2 { get; set; }
        // public  User FieldTech1 { get; set; }
        // public  User FieldTech2 { get; set; }
        // public  User Hotliner1 { get; set; }
        // public  User Hotliner2 { get; set; }
        // public  RepairAction RepairAction1 { get; set; }
        // public  RepairAction RepairAction2 { get; set; }
        // public  Tablet Tablet { get; set; }
        // public  Tablet TabletEx { get; set; }
        // public  ICollection<InventOp> InventOp { get; set; }
    }
}
