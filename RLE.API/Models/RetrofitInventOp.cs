using System;

namespace RLE.API.Models
{
    public class RetrofitInventOp
    {
        public RetrofitInventOp()
        {
            InsertDate = DateTime.Now;
        }
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? ToStoreId { get; set; }
        public RetrofitStore ToStore { get; set; }
        public int? FromStoreId { get; set; }
        public RetrofitStore FromStore { get; set; }
        public int Qty { get; set; }
        public Product Product { get; set; }
        public DateTime OpDate { get; set; }
        public DateTime InsertDate { get; set; }

        public int InventOpTypeId { get; set; }
        public InventOpType InventOpType { get; set; }
    }
}