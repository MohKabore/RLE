import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-pre-selection',
  templateUrl: './pre-selection.component.html',
  styleUrls: ['./pre-selection.component.scss'],
  animations: [SharedAnimations]
})
export class PreSelectionComponent implements OnInit {
  searchForm: FormGroup;
  searchControl: FormControl = new FormControl();
  users: any[];
  filteredUsers: User[];
  typeEmps: any = [];
  regions: any = [];
  depts: any = [];
  cities: any = [];
  isSelected: any = [];
  noResult = '';
  usersDiv = false;
  showRegions = false;
  page = 1;
  pageSize = 8;
  typeEmpId: number;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.typeEmpId = this.authService.currentUser.typeEmpId;
    this.getTypeEmps();
    if (!this.authService.isMaintenancier()) {
      this.getRegions();
      this.showRegions = true;
    } else {
      this.getDepartments();
    }
    this.createSearchForms();
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      this.filerData(value);
    });
  }

  getTypeEmps() {
    this.authService.getInscTypeEmps().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.typeEmps = [...this.typeEmps, element];
      }
    });
  }

  getDepartments() {
    let regionId: number;
    if (!this.authService.isMaintenancier()) {
      regionId = Number(this.searchForm.value.regionId);
    } else {
      regionId = Number(this.authService.currentUser.regionId);
    }

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
    this.userService.searchEmps(searchValues).subscribe((res: User[]) => {
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

  setSelection(absenceData) {

    const index = absenceData.index;
    const userId = absenceData.userId;
    const idx = this.users.findIndex(a => a.id === userId);
    this.users[idx].isSelected = !this.users[index].isSelected;
    const selectPos = this.isSelected.findIndex(s => Number(s.userId) === userId);
    if (selectPos !== -1) {
      // l'element existe
      this.isSelected.splice(selectPos, 1);
    } else {
      this.isSelected = [...this.isSelected, absenceData];
    }
  }
  initialize() {
    this.searchForm.reset();
    this.usersDiv = false;
    this.users = [];
    this.filteredUsers = [];
  }

  save() {
    this.userService.savePreSelection(this.isSelected, this.authService.decodedToken.nameid).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.isSelected = [];
      this.searchEmp();
    }, error => {
      console.log(error);
    });
  }
  reachable() {
    this.userService.saveReachable(this.isSelected).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.isSelected = [];
      this.searchEmp();
    }, error => {
      console.log(error);
    });
  }

  unReachable() {
    this.userService.saveUnReachable(this.isSelected).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.isSelected = [];
      this.searchEmp();
    }, error => {
      console.log(error);
    });
  }

  disclaimer() {
    this.userService.saveDisclaimer(this.isSelected).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.isSelected = [];
      this.searchEmp();
    }, error => {
      console.log(error);
    });
  }

}
