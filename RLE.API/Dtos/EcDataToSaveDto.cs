using System;

namespace RLE.API.Dtos
{
    public class EcDataToSaveDto
    {
        public EcDataToSaveDto()
        {
            InsertDate = DateTime.Now;
        }
        public int Cat1 { get; set; }
        public int Cat2 { get; set; }
        public int regionId  { get; set; }
        public int TabletId { get; set; }
        public DateTime OpDate { get; set; }
        public DateTime InsertDate { get; set; }
    }
}