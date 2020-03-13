using RLE.API.Models;

namespace RLE.API.Dtos
{
    public class ImeiVerificationDto
    {
        public string Imei { get; set; }
        public int?  Id { get; set; }
        public bool Exist { get; set; }
        public int? StoreId { get; set; }
        public Store Store { get; set; }

    }
}