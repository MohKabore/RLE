using System;
using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class RetrofitHistoryDto
    {
        public int?  StoreId { get; set; }
        public List<int?> StoreIds { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}