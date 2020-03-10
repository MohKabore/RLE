using System;

namespace RLE.API.Dtos
{
    public class OpAssignmentDto
    {
    //       cityId: [null, Validators.required],
    //   departmentId: [null, Validators.required],
    //   regionId: ['', Validators.required],
    //   municipalityId: ['', Validators.required],
    //   enrolmentCenterId: ['', Validators.required],
    //   tabletId: ['', Validators.required],
    //   employeeId: ['', Validators.required],
    //   opDate: ['', Validators.required]
            public DateTime  OpDate{ get; set; }
            public int EmployeeId { get; set; }
            public int TabletId { get; set; }
            public int enrolmentCenterId { get; set; }

    }
}