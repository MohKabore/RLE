namespace RLE.API.Dtos
{
    public class MunicipalityForCreationDto
    {
        public MunicipalityForCreationDto()
        {
            PollingPlaces = 0;
        }
        public int? CityId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int PollingPlaces { get; set; }
    }
}