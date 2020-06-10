namespace RLE.API.Dtos
{
    public class TabletDetailDto
    {
          public int Id { get; set; }
        public int? StoreId { get; set; }
        public string StoreName { get; set; }
        public string Imei { get; set; }
        public byte Status { get; set; }
        public bool Active { get; set; }
        public bool Type { get; set; }
        public int? EmployeeId { get; set; }  
        public string EmpName { get; set; }      
        public string Detail { get; set; }
        public int TabletTypeId { get; set; }
    }
}