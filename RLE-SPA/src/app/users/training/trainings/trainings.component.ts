import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Training } from 'src/app/_models/training';
import { Utils } from 'src/app/shared/utils';


@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {
  trainingForm: FormGroup;
  searchForm: FormGroup;
  trainngClassForm: FormGroup;
  birthDateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  regions: any = [];
  depts: any = [];
  cities: any = [];
  maints: any = [];
  trainings: Training[] = [];
  trainingId: number;
  regionId: number;
  showRegions = false;
  showTrainings = false;
  showClassDiv = false;
  trainingModel: any;
  editionMode = '';
  noResult = '';
  page = 1;
  pageSize = 50;
  currentUserId: number;
  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    if (!this.authService.isMaintenancier()) {
      this.getRegions();
      this.showRegions = true;
      this.createSearchForms();
    } else {
      this.regionId = this.authService.currentUser.regionId;
      this.getTrainings();
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
  getTrainings() {
    this.showTrainings = true;
    this.trainings = [];
    this.noResult = '';
    if (!this.authService.isMaintenancier()) {
      this.regionId = this.searchForm.value.regionId;
    }

    this.userService.getTrainingsBYRegionId(this.regionId).subscribe((res: Training[]) => {
      if (res.length > 0) {
        this.trainings = res;

      } else {
        this.noResult = 'aucune formation trouvée dans cette région...';
      }
    }, error => {
      console.log(error);
    });


  }

  showtrainingForm(model) {
    if (model === null) {
      this.editionMode = 'add';
      this.trainingModel = { name: '', description: '' };
    } else {
      this.trainingModel = model;
      this.editionMode = 'edit';
    }

    this.createTainingForms();
  }

  createTainingForms() {
    this.trainingForm = this.fb.group({
      name: [this.trainingModel.name, Validators.required],
      description: [this.trainingModel.description]
    });
  }

  saveTraining(continuer: boolean) {
    if (this.editionMode === 'add') {
      this.createTraining(continuer);
    } else {
      this.editTraining();
    }
  }

  createTraining(continuer: boolean) {
    this.trainingId = null;
    const training = this.trainingForm.value;
    training.regionId = this.regionId;



    if (continuer === false) {
      this.userService.addTraining(training, this.currentUserId).subscribe(() => {
        this.alertify.success('formation ajouté...');
        this.getTrainings();
      }, error => {
        console.log(error);
      });
    } else {
      this.userService.addTraining(training, this.currentUserId).subscribe((id: number) => {
        this.getSelectedMaints();
        this.getDepartments();
        this.createTainingClassForms();
        this.trainingId = id;
        this.getTrainings();
        this.alertify.success('formation ajoutée...');
      }, error => {
        console.log(error);
      });
    }
  }

  editTraining() {
    const training = this.trainingForm.value;
    this.userService.editTraining(training, this.trainingModel.id, this.currentUserId).subscribe(() => {
      this.getTrainings();
      this.alertify.success('modification enregistrée...');
    }, error => {
      console.log(error);
    });
  }

  createSearchForms() {
    this.searchForm = this.fb.group({
      regionId: [null],
    });
  }

  createTainingClassForms() {
    this.trainngClassForm = this.fb.group({
      name: ['', Validators.required],
      trainerIds: [null, Validators.required],
      departmentId: [null],
      cityId: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }


  getDepartments() {
    this.depts = [];
    this.cities = [];
    if (this.regionId) {
      this.depts = [];
      this.cities = [];
      this.authService.getDeptsByRegionid(this.regionId).subscribe((res: any[]) => {
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].name };
          this.depts = [...this.depts, element];
        }
      });
    }
  }

  getCities() {
    const departmentId = this.trainngClassForm.value.departmentId;
    this.cities = [];
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

  saveClass(close: boolean) {
    const trainingClass = this.trainngClassForm.value;
    trainingClass.regionId = this.regionId;
    trainingClass.trainingid = this.trainingId;
    trainingClass.startDate = Utils.inputDateDDMMYY(trainingClass.startDate, '/');
    trainingClass.endDate = Utils.inputDateDDMMYY(trainingClass.endDate, '/');
    this.userService.addtrainingClass(trainingClass, this.currentUserId).subscribe(() => {
      this.alertify.success('salle de formation ajoutée...');
      if (close === true) {
        this.getTrainings();
      } else {
        this.trainngClassForm.reset();
        this.getTrainings();
      }
    }, error => {
      console.log(error);
    });
  }

  getSelectedMaints() {
    this.maints = [];
    this.userService.getSelectedMaintsByRegionId(this.regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].lastName + ' ' + res[i].firstName };
        this.maints = [...this.maints, element];
      }
    }, error => {
      console.log(error);
    });
  }

  deleteTraining(trainingId) {
   if (confirm('voulez-vous vraiment supprimer cette formation ??')) {
    this.userService.deleteTraining(trainingId, this.currentUserId).subscribe(() => {
      this.getTrainings();
      this.alertify.success('supppression terminée...');
    }, error => {
      console.log(error);
    });
   }
  }

}
