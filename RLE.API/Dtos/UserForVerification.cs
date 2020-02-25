using System;

namespace RLE.API.Dtos
{
    public class UserForVerification
    {
        public int? TypeEmpId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte?   Gender { get; set; }
        public int? DepartmentId { get; set; }
        public int? RegionId { get; set; }
        public int? ResCityId { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }


    }
}