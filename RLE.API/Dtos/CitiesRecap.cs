namespace RLE.API.Dtos
{
    public class CitiesRecap
    {
        public CitiesRecap()
        {
            TotalCities = 0;
            RedCities = 0;
            OrangeCities = 0;
            BleuCities = 0;
            GreenCities = 0;
        }
        public int TotalCities { get; set; }
        public int RedCities { get; set; }
        public int OrangeCities { get; set; }

        public int BleuCities { get; set; }
        public int GreenCities { get; set; }

    }
}