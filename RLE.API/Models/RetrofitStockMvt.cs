using System;

namespace RLE.API.Models
{
    public class RetrofitStockMvt
    {
        public int Id { get; set; }
        public DateTime MvtDate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int InventOpTypeId { get; set; }
        public InventOpType InventOpType { get; set; }
         public int? ToStoreId { get; set; }
        public RetrofitStore ToStore { get; set; }
        public int? FromStoreId { get; set; }
        public RetrofitStore FromStore { get; set; }

    }
}