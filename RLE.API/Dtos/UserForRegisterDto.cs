using System;

namespace RLE.API.Dtos
{
    public class UserForRegisterDto
    {
        public UserForRegisterDto()
        {
            Hired = false;
            Active = false;
            PreSelected = false;
            Selected = false;
            ValidatedCode = false;
            Created = DateTime.Now;
            ValidatedCode = false;
            Trained = false;
            OnTraining = false;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public byte Gender { get; set; }
        public string SecondPhoneNumber { get; set; }
        public string ValidationCode { get; set; }
        public bool ValidatedCode { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime Created { get; set; }

        public string Idnum { get; set; }


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
        public string Atnum { get; set; }
        public int? StudyLevelId { get; set; }
        public int? EducationalTrackId { get; set; }
        public DateTime InsertDate { get; set; }

        public bool PreSelected { get; set; }
        // sélectionné apres formation mais pas encore retenu definitivement(peut etre donc dans la reserve)
        public bool Selected { get; set; }
        public bool OnTraining { get; set; }
        // selectionné et affecté
        public bool Hired { get; set; }
        // compte supprimé ou activé
        public bool Active { get; set; }

        public bool Trained { get; set; }

    }
}