using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace RLE.API.Models
{
    public class User : IdentityUser<int>
    {
        public User()
        {
            Active = true;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public byte Gender { get; set; }
        public string SecondPhoneNumber { get; set; }
        public string ValidationCode { get; set; }
        public DateTime? ValidationDate { get; set; }
        public bool ValidatedCode { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
        public int ForgotPasswordCount { get; set; }
        public int ResetPasswordCount { get; set; }
        public byte TempData { get; set; }
        public string Idnum { get; set; }
        public int? TabletId { get; set; }
        public Tablet Tablet { get; set; }

        public int? EnrolmentCenterId { get; set; }
        public EnrolmentCenter EnrolmentCenter { get; set; }

        public int? TypeEmpId { get; set; }
        public TypeEmp TypeEmp { get; set; }

        public int? ZoneId { get; set; }
        public Zone Zone { get; set; }

        public int? RegionId { get; set; }
        public Region Region { get; set; }

        public int? DepartmentId { get; set; }
        public Department Department { get; set; }

        public int? ResCityId { get; set; }
        public City ResCity { get; set; }


        public int? MunicipalityId { get; set; }
        public Municipality Municipality { get; set; }

        public DateTime DateOfBirth { get; set; }
        public int? MaritalStatusId { get; set; }
        public MaritalStatus MaritalStatus { get; set; }

        public int? NbChild { get; set; }
        // public int? BirthPlaceId { get; set; }
        public string BirthPlace { get; set; }

        public int? NationalityId { get; set; }
        public Country Nationality { get; set; }

        public string Cni { get; set; }
        public string Passport { get; set; }
        public string Iddoc { get; set; }
        public string Atnum { get; set; }
        public int? StudyLevelId { get; set; }
        public StudyLevel StudyLevel { get; set; }

        public int? EducationalTrackId { get; set; }
        public EducationalTrack EducationalTrack { get; set; }

        public byte Paid { get; set; }
        public DateTime InsertDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public byte? Version { get; set; }

        // prelectionné mais pas encore séléctionné apres formation
        public bool PreSelected { get; set; }
        // sélectionné apres formation mais pas encore retenu definitivement(peut etre donc dans la reserve)
        public bool Selected { get; set; }
        // selectionné et affecté
        public bool Hired { get; set; }
        // en formation ou former
        public bool Trained { get; set; }
        // compte supprimé ou activé
        public bool Active { get; set; }
        public bool Reserved { get; set; }
        public bool OnTraining { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public DateTime? ForgotPasswordDate { get; set; }
        public int Nok { get; set; }

        // public  ICollection<Ecdeployment> Ecdeployment { get; set; }
        // public  ICollection<EmpHistory> EmpHistory { get; set; }
        // public  ICollection<Export> Export { get; set; }
        // public  ICollection<Failure> FailureFieldTech1 { get; set; }
        // public  ICollection<Failure> FailureFieldTech2 { get; set; }
        // public  ICollection<Failure> FailureHotliner1 { get; set; }
        // public  ICollection<Failure> FailureHotliner2 { get; set; }
        // public  ICollection<InventOp> InventOpFromEmployee { get; set; }
        // public  ICollection<InventOp> InventOpToEmployee { get; set; }
        // public  ICollection<Sdcard> Sdcard { get; set; }
        // public  ICollection<SdcardTablet> SdcardTablet { get; set; }
        // public  ICollection<StockMvt> StockMvtFromEmployee { get; set; }
        // public  ICollection<StockMvt> StockMvtToEmployee { get; set; }
        // public  ICollection<Store> Store { get; set; }
        // public  ICollection<TrainerClass> TrainerClass { get; set; }

    }
}