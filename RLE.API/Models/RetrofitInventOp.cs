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
        public Product Product { get; set; }
        public DateTime OpDate { get; set; }
        public DateTime InsertDate { get; set; }
    }
}