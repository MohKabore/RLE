using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Municipality
    {
        public Municipality()
        {
            // Employee = new HashSet<User>();
            // EnrolmentCenter = new HashSet<EnrolmentCenter>();
            // TrainingClass = new HashSet<TrainingClass>();
        }

        public int Id { get; set; }
        public int? CityId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int PollingPlaces { get; set; }

        public  City City { get; set; }
        public virtual  ICollection<User> Employee { get; set; }
        public  virtual  ICollection<EnrolmentCenter> EnrolmentCenters { get; set; }
        public virtual  ICollection<TrainingClass> TrainingClass { get; set; }
    }
}
