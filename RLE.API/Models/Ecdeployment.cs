using System;
using System.Collections.Generic;

namespace RLE.API.Models
{
    public partial class Ecdeployment
    {
        public int Id { get; set; }
        public int? EnrolmentCenterId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? EcdeploymentDate { get; set; }

        public  User Employee { get; set; }
        public  EnrolmentCenter EnrolmentCenter { get; set; }
    }
}
