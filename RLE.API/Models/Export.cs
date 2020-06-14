using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Export
    {
        public Export()
        {
            InsertDate = DateTime.Now;
            Status = 0;
        }

        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string Renum { get; set; }
        public DateTime ExportDate { get; set; }
        public byte Status { get; set; }
        public DateTime InsertDate { get; set; }

        public  User Employee { get; set; }
        public  ICollection<Sdcard> Sdcards { get; set; }
    }
}
