namespace RLE.API.Dtos
{
    public class TrainingsPointRecapDto
    {
        public TrainingsPointRecapDto()
        {
            TotalReserved = 0;
            TotalOnTraining =0;
            TotalSelected =0;
            TotalReserved =0;
            NbEmpNeeded =0;
            TotalRegisteredPrct =0;
            TotalReserveToHave =0;
        }
        public int TotalRegistered { get; set; }
        public int TotalOnTraining { get; set; }
        public int TotalSelected { get; set; }
        public int TotalReserved { get; set; }
          public int NbEmpNeeded { get; set; }
        public int TotalRegisteredPrct { get; set; }
        public int TotalReserveToHave { get; set; }

    }
}