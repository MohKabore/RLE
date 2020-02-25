import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { TrainingClass } from 'src/app/_models/trainingClass';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { debounceTime } from 'rxjs/operators';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-pre-selected-users',
  templateUrl: './pre-selected-users.component.html',
  styleUrls: ['./pre-selected-users.component.scss'],
  animations: [SharedAnimations]
})
export class PreSelectedUsersComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  currentUserId: number;
  trainingClassid: number;
  depts: any = [];
  cities: any = [];
  isSelected: any = [];
  users: any[];
  filteredUsers: User[];
  typeEmps: any = [];
  searchForm: FormGroup;
  usersDiv = false;
  page = 1;
  pageSize = 8;
  trainingClass: TrainingClass;
  noResult = '';
  regionId;


  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute,
    private alertify: AlertifyService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.trainingClassid = params.id;
    });
    this.getTrainingClassDetails(this.trainingClassid);
    this.getTypeEmps();
    // this.getDepartments();
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
  getTrainingClassDetails(id) {
    this.userService.getTrainingClassDetails(id).subscribe((res: TrainingClass) => {
      console.log(res);
      this.regionId = res.regionId;
      this.trainingClass = res;
      this.getDepartments();
    }, error => {
      console.log(error);
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

  createSearchForms() {
    this.searchForm = this.fb.group({
      resCityId: [null],
      departmentId: [null],
      typeEmpId: [null]
    });
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

  searchEmp() {
    const searchValues = this.searchForm.value;
    this.users = [];
    this.noResult = '';
    this.usersDiv = true;
    this.userService.searchPreSelectedEmps(searchValues).subscribe((res: User[]) => {
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

  initialize() {
    this.searchForm.reset();
    this.usersDiv = false;
    this.users = [];
    this.filteredUsers = [];
  }

  getDepartments() {
    this.depts = [];
    this.cities = [];
    this.authService.getDeptsByRegionid(this.regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.depts = [...this.depts, element];
      }
    });
  }

  save() {
    this.userService.addUserToClass(this.trainingClassid, this.isSelected, this.authService.decodedToken.nameid).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.isSelected = [];
      this.searchEmp();
    }, error => {
      console.log(error);
    });
  }


}
