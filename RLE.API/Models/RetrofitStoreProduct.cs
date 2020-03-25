namespace RLE.API.Models
{
    public class RetrofitStoreProduct
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int RetrofitStoreId { get; set; }
        public RetrofitStore RetrofitStore { get; set; }
        public int Qty { get; set; }
    }
}