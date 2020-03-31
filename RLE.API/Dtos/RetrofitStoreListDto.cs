using System.Collections.Generic;
using RLE.API.Models;

namespace RLE.API.Dtos
{
    public class RetrofitStoreListDto
    {
        public int Id { get; set; }
        public List<RetrofitStoreProduct> Products { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }
}