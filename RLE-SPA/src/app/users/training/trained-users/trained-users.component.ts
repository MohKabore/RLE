import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-trained-users',
  templateUrl: './trained-users.component.html',
  styleUrls: ['./trained-users.component.scss']
})
export class TrainedUsersComponent implements OnInit {
  searchForm: FormGroup;
  currentUserId: number;
  regions: any = [];
  users: any[];
  filteredUsers: any[];
  trainings: any = [];
  trainingClasses: any = [];
  showEmps = false;
  isSelected: any = [];
  totalReserved = 0;
  totalSelected = 0;
  searchControl: FormControl = new FormControl();



  headElements = ['id', 'nom', 'Prenoms', 'Contact', 'Poste', 'Region', 'Departement', 'Ville'];

  regionId = null;
  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    if (this.authService.isMaintenancier()) {
      this.regionId = this.authService.currentUser.regionId;
      this.getTrainings();
    } else {
      this.getRegions();
    }
    this.createSearchForms();
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      this.filerData(value);
    });
  }


  createSearchForms() {
    this.searchForm = this.fb.group({
      regionId: [this.regionId],
      trainingId: [null],
      trainingClassId: [null]
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

  getTrainings() {
    if (!this.authService.isMaintenancier()) {
      this.regionId = this.searchForm.value.regionId;
    }

    this.trainings = [];
    this.trainingClasses = [];
    this.users = [];
    this.showEmps = false;
    this.userService.getRegionTrainings(this.regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.trainings = [...this.trainings, element];
      }
    });

  }

  getTrainingClasses() {
    const trainingId = this.searchForm.value.trainingId;

    this.trainingClasses = [];
    this.userService.getClosedTrainingClasses(trainingId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.trainingClasses = [...this.trainingClasses, element];
      }
    });

  }


  initialize() {
    this.showEmps = false;
    this.trainingClasses = [];
    if (!this.authService.isMaintenancier()) {
      this.trainings = [];

    }
    this.searchForm.reset();
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
    this.users = [];
    this.filteredUsers = [];
    this.showEmps = false;
    this.totalSelected = 0;
    this.totalSelected = 0;
    const formData = this.searchForm.value;
    formData.regionId = this.regionId;
    this.userService.getTrainedUsers(formData).subscribe((res: User[]) => {
      this.users = res;
      this.filteredUsers = res;
      this.totalSelected = res.filter(a => a.selected === true).length;
      this.totalReserved = res.filter(a => a.reserved === true).length;
      this.showEmps = true;
    }, error => {
      console.log(error);
    });

  }

  select(e) {
    const idx = this.isSelected.indexOf(e);
    if (idx === -1) {
      this.isSelected = [...this.isSelected, e];
    } else {
      this.isSelected.splice(idx,1);
    }
  }

  removeSelectedUsers() {
    if (confirm('confirmez-vous la désélection ??')) {
      this.userService.unSelectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        for (let i = 0; i < this.isSelected.length; i++) {
          const elt = this.isSelected[i];
          let curUser = this.users.find(a => a.id === elt);
          curUser.selected = false;
          curUser.selectionne = false;
          this.totalSelected = this.totalSelected - 1;
        }
        this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }

  selectUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      this.userService.selectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        for (let i = 0; i < this.isSelected.length; i++) {
          const elt = this.isSelected[i];
          let curUser = this.users.find(a => a.id === elt);
          curUser.selectionne = false;
          curUser.selected = true;
          this.totalSelected = this.totalSelected + 1;
        }
        this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }


  reserveUsers() {
    if (confirm('confirmez-vous la mise en reserve ??')) {
      this.userService.reserveUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        for (let i = 0; i < this.isSelected.length; i++) {
          const elt = this.isSelected[i];
          let curUser = this.users.find(a => a.id === elt);
          curUser.selectionne = false;
          curUser.reserved = true;
          this.totalReserved = this.totalReserved + 1;
        }
        this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }

  removeReservedUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      this.userService.unReserveUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        for (let i = 0; i < this.isSelected.length; i++) {
          const elt = this.isSelected[i];
          let curUser = this.users.find(a => a.id === elt);
          curUser.reserved = false;
          curUser.selectionne = false;
          this.totalReserved = this.totalReserved - 1;
        }
        this.filteredUsers = this.users;
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }



}
