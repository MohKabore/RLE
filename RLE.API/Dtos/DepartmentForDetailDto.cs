using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class DepartmentForDetailDto
    {
        public DepartmentForDetailDto()
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

        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? RegionId { get; set; }
        public int NbEmpNeeded { get; set; }

        public int TotalRegistered { get; set; }
        public int TotalPreSelected { get; set; }
        public int TotalOnTraining { get; set; }
        public int TotalSelected { get; set; }
        public double PrctRegistered { get; set; }
        public double PrctPreselected { get; set; }
        public double PrctOnTraining { get; set; }
        public double PrctSelected { get; set; }

        public bool ActiveforInscription { get; set; }
        public List<CityForDetailDto> Cities { get; set; }
    }
}