using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class City
    {
        public City()
        {
         
            // Municipality = new HashSet<Municipality>();
          
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? DepartmentId { get; set; }
        public int? CityTypeId { get; set; }
        public int Kits { get; set; }
        public int PollingPlaces { get; set; }
        public int NbEmpNeeded { get; set; }
        public byte Active { get; set; }
        public bool ActiveforInscription { get; set; }
        public  CityType CityType { get; set; }
        public  Department Department { get; set; }
        public  List<Municipality> Municipalities { get; set; }

        // public  ICollection<Address> Address { get; set; }
        // public  ICollection<Circuit> Circuit { get; set; }
        // public  ICollection<CityCircuit> CityCircuitFromCity { get; set; }
        // public  ICollection<CityCircuit> CityCircuitToCity { get; set; }
        // public  ICollection<CityZone> CityZone { get; set; }
        // public  ICollection<User> EmployeeBirthPlace { get; set; }
        // public  ICollection<User> EmployeeResCity { get; set; }
        // public  ICollection<Store> Store { get; set; }
        // public  ICollection<TrainingClass> TrainingClass { get; set; }
    }
}
