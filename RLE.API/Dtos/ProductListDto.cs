using System.Collections.Generic;
using RLE.API.Models;

namespace RLE.API.Dtos
{
    public class ProductListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<RetrofitStoreProduct> Stores { get; set; }
    }
}