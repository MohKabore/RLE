using RLE.API.Models;

namespace RLE.API.Dtos
{
    public class EcCodeToVerify
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool Exist { get; set; }
        public int? MunicipalityId { get; set; }
        public Municipality Municipality { get; set; }
        public int Indx { get; set; }
    }
}