namespace RLE.API.Models
{
    public class RetrofitStockMvtInventOp
    {
        public int Id { get; set; }
        public int RetrofitStockMvtId { get; set; }
        public RetrofitStockMvt RetrofitStockMvt { get; set; }
        public int RetrofitInventOpId { get; set; }
        public RetrofitInventOp RetrofitInventOp { get; set; }
    }
}