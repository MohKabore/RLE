using System;
using System.Collections.Generic;

namespace RLE.API.Dtos
{
    public class ExportToCreateDto
    {
    
    public int RegionId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime ExportDate { get; set; }
    public string Renum { get; set; }
    public List<int> SdcardIds { get; set; }
    
    }
}