namespace RLE.API.Dtos
{
    public class RetrofitInventOpDto
    {
              public int Id { get; set; }
        public int ProductId { get; set; }
        public int? ToStoreId { get; set; }
        public string ToStoreName { get; set; }
        public int? FromStoreId { get; set; }
        public string FromStoreName { get; set; }
        public int Qty { get; set; }
        public string ProductName { get; set; }
        public string OpDate { get; set; }

        public int InventOpTypeId { get; set; }
        public string InventOpTypeName { get; set; }
    }
}