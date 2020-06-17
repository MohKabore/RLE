using System;

namespace RLE.API.Models
{
    public class EcData
    {
       
        public int Id { get; set; }
        public int Cat1 { get; set; }
        public int Cat2 { get; set; }
        public int TabletId { get; set; }
        public int RegionId { get; set; }
        public int? TabletRepairCounter { get; set; }
        public DateTime OpDate { get; set; }
        public DateTime InsertDate { get; set; }
        public int InsertUserId { get; set; }
        public Tablet Tablet { get; set; }
        public Region Region { get; set; }
    }
}