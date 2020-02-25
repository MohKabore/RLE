using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class CityCircuit
    {
        public int Id { get; set; }
        public int CircuitId { get; set; }
        public int FromCityId { get; set; }
        public int ToCityId { get; set; }
        public int DsplSeq { get; set; }
        public int Distance { get; set; }
        public int? RouteTypeId { get; set; }

        public  Circuit Circuit { get; set; }
        public  City FromCity { get; set; }
        public  City ToCity { get; set; }
    }
}
