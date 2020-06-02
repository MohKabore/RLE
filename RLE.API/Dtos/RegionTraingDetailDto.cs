namespace RLE.API.Dtos
{
    public class RegionTraingDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TotalRegistered { get; set; }
        public int TotalOntraining { get; set; }
        public int TotalSelected { get; set; }
        public int TotalReserved { get; set; }
        public int NbEmpNeeded { get; set; }
        public int TotalRegisteredPrct { get; set; }
        public int TotalReserveToHave { get; set; }

    }
}