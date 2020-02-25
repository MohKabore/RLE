namespace RLE.API.Dtos
{
    public class EmpSearchModelDto
    {
        public int? TypeEmpId { get; set; }
        public int? RegionId { get; set; }
        public int? DepartmentId { get; set; }
        public int? ResCityId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string EmpName { get; set; }
    }
}