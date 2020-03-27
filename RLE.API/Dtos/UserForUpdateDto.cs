using System;

namespace RLE.API.Dtos
{
    public class UserForUpdateDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public byte Gender { get; set; }
        public string SecondPhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }



        public int TypeEmpId { get; set; }

        public int? ZoneId { get; set; }

        public int? RegionId { get; set; }

        public int? DepartmentId { get; set; }

        public int? ResCityId { get; set; }


        public int? MunicipalityId { get; set; }

        public DateTime? BirthDate { get; set; }
        public int? MaritalStatusId { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int? NbChild { get; set; }
        public string BirthPlace { get; set; }

        public int? NationalityId { get; set; }

        public string Cni { get; set; }
        public string Passport { get; set; }
        public string Iddoc { get; set; }
        public int? StudyLevelId { get; set; }
        public int? EducationalTrackId { get; set; }

        public int? EnrolmentCenterId { get; set; }
        public int? StoreId { get; set; }
        public int? TabletId { get; set; }
    }
}