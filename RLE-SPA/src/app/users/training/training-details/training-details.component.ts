import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Training } from 'src/app/_models/training';
import { Utils } from 'src/app/shared/utils';
import { TrainingClass } from 'src/app/_models/trainingClass';


@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.scss']
})
export class TrainingDetailsComponent implements OnInit {
  trainngClassForm: FormGroup;
  trainingId: number;
  regionId: number;
  maints: any[] = [];
  depts: any[] = [];
  cities: any[] = [];
  classModel: any = {};
  training: Training;
  currentUserId: number;
  editionMode = '';
  birthDateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  constructor(private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute,
    private alertify: AlertifyService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    this.route.data.subscribe(data => {
      this.training = data.training;
      this.trainingId = this.training.id;
      this.regionId = this.training.regionId;
    });
    this.createTainingClassForms();
  }

  createTainingClassForms() {
    this.trainngClassForm = this.fb.group({
      name: [this.classModel.name, Validators.required],
      trainerIds: [this.classModel.trainerIds, Validators.required],
      departmentId: [this.classModel.departmentId],
      cityId: [this.classModel.cityId],
      startDate: [this.classModel.startDate, Validators.required],
      endDate: [this.classModel.endDate, Validators.required]
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

  getCities(departmentId) {
    if (departmentId == null) {
      departmentId = this.trainngClassForm.value.departmentId;
    }
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

  showModal(model) {
    this.getSelectedMaints();
    this.getDepartments();
    this.trainngClassForm.reset();
    if (!model) {
      this.editionMode = 'add';
      this.classModel = {};
    } else {
      this.classModel = model;
      this.editionMode = 'edit';
      if (model.departmentId != null) {
        this.getCities(model.departmentId);
      }
    }
    this.createTainingClassForms();
  }

  save() {
    if (this.editionMode === 'add') {
      this.saveClass();
    } else {
      this.editClass();
    }
  }


  saveClass() {
    const trainingClass = this.trainngClassForm.value;
    trainingClass.regionId = this.regionId;
    trainingClass.trainingid = this.trainingId;
    trainingClass.startDate = Utils.inputDateDDMMYY(trainingClass.startDate, '/');
    trainingClass.endDate = Utils.inputDateDDMMYY(trainingClass.endDate, '/');
    this.userService.addtrainingClass(trainingClass, this.currentUserId).subscribe((newClass: TrainingClass) => {
      this.training.trainingClasses = [... this.training.trainingClasses, newClass];
      this.alertify.success('salle de formation ajoutée...');
      this.trainngClassForm.reset();
    }, error => {
      console.log(error);
    });
  }

  editClass() {
    const trainingClass = this.trainngClassForm.value;
    trainingClass.trainingId = this.trainingId;
    trainingClass.regionId = this.regionId;
    trainingClass.startDate = Utils.inputDateDDMMYY(trainingClass.startDate, '/');
    trainingClass.endDate = Utils.inputDateDDMMYY(trainingClass.endDate, '/');
    this.userService.editTrainingClass(trainingClass, this.classModel.id, this.currentUserId).subscribe((classFromApi: TrainingClass) => {
      const idx = this.training.trainingClasses.findIndex(a => a.id === classFromApi.id);
      this.training.trainingClasses[idx] = classFromApi;
      this.alertify.success('modification enregistrée...');
      this.trainngClassForm.reset();
    }, error => {
      console.log(error);
    });
  }

  deleteTrainingClass(trainingClassId, idx) {
    if (confirm('voulez-vous vraiment supprimez cette salle ?')) {
      this.userService.deleteTrainingClass(trainingClassId, this.currentUserId).subscribe(() => {
        this.training.trainingClasses.splice(idx, 1);
        this.alertify.success('suppression terminé...');
      });
    }
  }

  closeTraining(trainingClassId, idx) {
    if (confirm('voulez-vous vraiment cloturer cette salle ?')) {
      this.userService.closeTrainingClass(trainingClassId, this.currentUserId).subscribe(() => {
        this.training.trainingClasses[idx].status = 1;
        this.alertify.success('salle de formation cloturée...');
      });
    }
  }


}
