import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { debounceTime } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  animations: [SharedAnimations]
})
export class EmployeesComponent implements OnInit {
  searchForm: FormGroup;
  searchControl: FormControl = new FormControl();

  users: User[];
  user: any;
  filteredUsers: User[];
  typeEmps: any = [];
  regions: any = [];
  depts: any = [];
  cities: any = [];
  isSelected: any = [];
  noResult = '';
  usersDiv = false;
  page = 1;
  pageSize = 8;
  viewMode = 'list';
  isMaintenancier = false;
  isHotliner = false;
  showDetails = false;
  showEditionDiv = false;
  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    if (this.authService.isMaintenancier()) {
      this.isMaintenancier = true;
    }

    if (this.authService.isHotliner()) {
      this.isHotliner = true;
    }
    this.getTypeEmps();
    this.getRegions();
    this.createSearchForms();
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      this.filerData(value);
    });
  }

  getdetails(userid) {
    this.showDetails = true;
    this.userService.getEmployeeDetails(userid).subscribe((res: User) => {
      this.user = res;
    }, error => {
      console.log(error);
    });
  }
  returnToList() {
    this.showDetails = false;
  }
  goToEditionDiv() {
    this.showEditionDiv = true;
    this.showDetails = false;
  }

  getTypeEmps() {
    if (this.isHotliner || this.isMaintenancier) {
      this.authService.getInscTypeEmps().subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].name };
          this.typeEmps = [...this.typeEmps, element];
        }
      });
    } else {
      this.authService.getTypeEmps().subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].name };
          this.typeEmps = [...this.typeEmps, element];
        }
      });
    }

  }

  getDepartments() {
    const regionId = this.searchForm.value.regionId;
    if (regionId) {
      this.depts = [];
      this.cities = [];
      this.authService.getDeptsByRegionid(regionId).subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].name };
          this.depts = [...this.depts, element];
        }
      });
    }
  }

  getCities() {
    const departmentId = this.searchForm.value.departmentId;
    if (departmentId) {
      this.cities = [];
      this.authService.getCitiesByDeptid(departmentId).subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].name };
          this.cities = [...this.cities, element];
        }
      });
    }
  }

  backToList() {
    this.showEditionDiv = false;
    this.showDetails = true;
  }


  getRegions() {
    this.authService.getRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }
  searchEmp() {
    const searchValues = this.searchForm.value;
    this.users = [];
    this.noResult = '';
    this.usersDiv = true;
    this.userService.searchEmployees(searchValues).subscribe((res: User[]) => {
      if (res.length > 0) {
        this.users = res;
        this.filteredUsers = res;
      } else {
        this.noResult = 'aucune personne trouvée...';
      }
    }, error => {
      console.log(error);
    });
  }


  createSearchForms() {
    this.searchForm = this.fb.group({
      resCityId: [null],
      departmentId: [null],
      regionId: [null],
      typeEmpId: [null],
      empName: ['']
    });
  }


  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.filteredUsers = [...this.users];
    }
    const columns = Object.keys(this.users[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.users.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.filteredUsers = rows;
  }

  initialize() {
    this.searchForm.reset();
    this.usersDiv = false;
    this.users = [];
    this.cities = [];
    this.depts = [];
    this.filteredUsers = [];
  }


}
