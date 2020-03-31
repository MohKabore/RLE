using System;
using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class RetrofitStockEntryDto
    {
        public DateTime MvtDate { get; set; }
        public int ToStoreId { get; set; }
        public int? FromStoreId { get; set; }
        public List<ProductMvtDto> Products { get; set; }

    }
}