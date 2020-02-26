using System;

namespace RLE.API.Dtos
{
    public class UserForListDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public int Age { get; set; }
        public string LastName { get; set; }
        public string PhotoUrl { get; set; }
        public string SecondPhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Idnum { get; set; }
        public int TypeEmpId { get; set; }
        public string TypeEmpName { get; set; }
        public int? RegionId { get; set; }
        public string RegionName { get; set; }
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int? ResCityId { get; set; }
        public string ResCityName { get; set; }
        public int? MaritalStatusId { get; set; }
        public string MaritalStatusName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int NbChild { get; set; }
        public string BirthPlace { get; set; }
        public string Cni { get; set; }
        public string Passport { get; set; }
        public string Iddoc { get; set; }
        public int? StudyLevelId { get; set; }
        public string StudyLevelName { get; set; }
        public int? EducationalTrackId { get; set; }
        public string EducationalTrackName { get; set; }
        public bool PreSelected { get; set; }
        // sélectionné apres formation mais pas encore retenu definitivement(peut etre donc dans la reserve)
        public bool Selected { get; set; }
        // selectionné et affecté
        public bool Hired { get; set; }
        // en formation ou former
        public bool Trained { get; set; }
        // compte supprimé ou activé
        public bool Active { get; set; }
        public bool OnTraining { get; set; }
    }
}