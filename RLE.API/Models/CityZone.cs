using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class CityZone
    {
        public int Id { get; set; }
        public int ZoneId { get; set; }
        public int CityId { get; set; }

        public  City City { get; set; }
        public  Zone Zone { get; set; }
    }
}
