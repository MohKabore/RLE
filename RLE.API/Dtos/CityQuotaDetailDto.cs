namespace RLE.API.Dtos
{
    public class CityQuotaDetailDto
    {
        public int Total { get; set; }
        public int TotalTrained { get; set; }
        public int Id { get; set; }
        public string CityName { get; set; }
        public int NbEmpNeeded { get; set; }
    }
}