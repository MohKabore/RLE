using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class EmpHistory
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public byte FromHired { get; set; }
        public byte ToHired { get; set; }
        public Guid UserId { get; set; }
        public DateTime InsertDate { get; set; }

        public  User Employee { get; set; }
    }
}
