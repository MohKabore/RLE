namespace RLE.API.Dtos
{
    public class MunForDetailDto
    {
        public MunForDetailDto()
        {
            TotalOnTraining = 0;
            TotalPreSelected = 0;
            TotalRegistered = 0;
            TotalSelected = 0;
            NbEmpNeeded = 0;
            PrctRegistered = 0;
            PrctPreselected = 0;
            PrctOnTraining = 0;
            PrctSelected = 0;
            TotalRegisteredPrct = 0;
            TotalPreSelectedPrct = 0;
            TotalOnTrainingPrct = 0;
            TotalSelectedPrct = 0;
            TotalReserveToHave = 0;
            TotalReserved =0;
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? DepartmentId { get; set; }
        public int NbEmpNeeded { get; set; }

        public int TotalRegistered { get; set; }
        public int TotalPreSelected { get; set; }
        public int TotalOnTraining { get; set; }
        public int TotalSelected { get; set; }

        public int TotalRegisteredPrct { get; set; }
        public int TotalPreSelectedPrct { get; set; }
        public int TotalOnTrainingPrct { get; set; }
        public int TotalSelectedPrct { get; set; }
        public bool ActiveforInscription { get; set; }
        public double PrctRegistered { get; set; }
        public double PrctPreselected { get; set; }
        public double PrctOnTraining { get; set; }
        public double PrctSelected { get; set; }
        public int TotalReserveToHave { get; set; }
        public int TotalReserved { get; set; }
    }
}