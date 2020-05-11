using System.Collections.Generic;
using RLE.API.Models;

namespace RLE.API.Dtos
{
    public class EcsForListDto
    {
        public EcsForListDto()
        {
            Operators = new List<UserForListDto>();
        }
        public int Id { get; set; }
        public int? MunicipalityId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string DisplayCode { get; set; }
        public Municipality Municipality { get; set; }
        public IEnumerable<UserForListDto> Operators { get; set; }

    }
}