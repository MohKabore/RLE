using System;

namespace RLE.API.Dtos
{
    public class RegionInscriptionDto
    {
        public RegionInscriptionDto()
        {
            TotalCat1=0;
            TotalCat2=0;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public int TotalCat1 { get; set; }
        public int TotalCat2 { get; set; }
        public DateTime? Lastestdate { get; set; }
    }
}