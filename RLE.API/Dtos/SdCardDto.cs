using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class SdCardDto
    {
        public SdCardDto()
        {
         Status = 0;   
        }
        public int EmployeeId { get; set; }
        public string Sdnum { get; set; }
        public bool FullExport { get; set; }
        public byte Status { get; set; }
        public int RegionId { get; set; }
        public List<SdCardTabletDto> SdcardTablets { get; set; }
    }
}