import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-trained-users',
  templateUrl: './trained-users.component.html',
  styleUrls: ['./trained-users.component.scss']
})
export class TrainedUsersComponent implements OnInit {
  searchForm: FormGroup;
  currentUserId: number;
  regions: any = [];
  users: User[];
  trainings: any = [];
  trainingClasses: any = [];
  showEmps = false;
  isSelected: any = [];
  totalReserved = 0;
  totalSelected = 0;


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
  }


  createSearchForms() {
    this.searchForm = this.fb.group({
      regionId: [this.regionId],
      trainingId: [null],
      trainingClassId: [null]
    });
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
    this.trainings = [];
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
    this.showEmps = false;
    this.totalSelected = 0;
    this.totalSelected = 0;
    const formData = this.searchForm.value;
    this.userService.getTrainedUsers(this.regionId, formData.trainingId, formData.trainingClassId).subscribe((res: User[]) => {
      this.users = res;
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
      this.isSelected.splice(idx);
    }
  }

  removeSelectedUsers() {
    if (confirm('confirmez-vous la désélection ??')) {
      this.userService.unSelectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.searchEmp();
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }

  selectUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      this.userService.selectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.searchEmp();
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }


  reserveUsers() {
    if (confirm('confirmez-vous la mise en reserve ??')) {
      this.userService.reserveUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.searchEmp();
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }

  removeReservedUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      this.userService.unReserveUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.searchEmp();
        this.isSelected = [];
        this.alertify.success('enregistrement terminé...');
      });
    }
  }



}
