using System;

namespace RLE.API.Dtos
{
    public class FailureToSaveDto
    {
        public FailureToSaveDto()
        {
            InsertDate = DateTime.Now;
        }
        public int? TabletId { get; set; }
        public int? TabletExId { get; set; }
        public int FailureList1Id { get; set; }//
        public int? FailureList2Id { get; set; }//
        public int Hotliner1Id { get; set; }//
        public int? Hotliner2Id { get; set; }//
        public int? RegionId { get; set; }//
        public int? FieldTech1Id { get; set; }//
        public int? FieldTech2Id { get; set; }//
        public int? RepairAction1Id { get; set; }//
        public int? RepairAction2Id { get; set; }//
        public DateTime FailureDate { get; set; }
        public DateTime? MaintDate { get; set; }
        public byte Repaired { get; set; }
        public string Note1 { get; set; }
        public string Note2 { get; set; }
        public string Imei { get; set; }
        public int? DepartmentId { get; set; }
        public DateTime InsertDate { get; set; }
        public bool Joined { get; set; }


    }
}