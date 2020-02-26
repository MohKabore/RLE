import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  phoneMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  birthDateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  cniMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  userForm: FormGroup;
  user: any;
  regions: any = [];
  depts: any = [];
  cities: any = [];
  typeEmps: any = [];
  studyLevels: any = [];
  educationTracks: any = [];
  maritalStatus: any = [];
  waitDiv = false;
  waitForValidation = true;
  userPhotoUrl = '';
  sexe = [
    { value: 1, label: 'Homme' },
    { value: 0, label: 'Femme' }
  ];
  file: File = null;
  operatorTypeId = environment.operatortypeId;
  maintenancierTypeId = environment.maintenancierTypeId;
  userExist = false;
  isMaintenancier = false;
  isHotliner = false;
  regionId: number;

  constructor(private fb: FormBuilder, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    if (this.authService.isMaintenancier()) {
      this.regionId = Number(this.authService.currentUser.regionId);
      this.isMaintenancier = true;
      this.getDepartments();
    }

    if (this.authService.isHotliner()) {
      this.isHotliner = true;
    }
    this.getEducationTracks();
    this.getStudyLevels();
    this.getRegions();
    this.getMaritalStatus();
    this.getTypeEmps();
    this.createUserForms();
  }

  createUserForms() {
    this.userForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      gender: [null, Validators.required],
      dateOfBirth: [''],
      resCityId: [null],
      departmentId: [null, Validators.required],
      regionId: [this.regionId, Validators.required],
      typeEmpId: [null, Validators.required],
      maritalStatusId: [null],
      educationalTrackId: [null],
      studyLevelId: [null],
      phoneNumber: ['', Validators.required],
      secondPhoneNumber: [''],
      birthPlace: [''],
      nbChild: [null],
      email: ['', [Validators.email]],
      cni: [''],
      passport: [''],
      iddoc: ['']
    });
  }

  verifyIfExist() {

    this.waitForValidation = true;
    this.userExist = false;
    const userdata = this.userForm.value;
    if (userdata.typeEmpId === this.operatorTypeId) {
      this.authService.operatorExist(userdata).subscribe((res: boolean) => {
        if (res === true) {
          this.userExist = true;
        }
        this.waitForValidation = false;
      }, error => {
        console.log(error);
      });
    } else if (userdata.typeEmpId === this.maintenancierTypeId) {
      this.authService.maintenancierExist(userdata).subscribe((res: boolean) => {
        if (res === true) {
          this.userExist = true;
        }
        this.waitForValidation = false;

      }, error => {
        console.log(error);
      });
    } else {
      this.userExist = false;
      this.waitForValidation = false;
    }
  }

  parentImgResult(event) {
    this.file = <File>event.target.files[0];

    // recuperation de l'url de la photo
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userPhotoUrl = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    // fin recupération


    // const imageExist = this.selectedFiles.find(t => t.spaCode === 1);
    // if (imageExist) {
    //   // une image existe deja dans le tableau
    //   imageExist.image = file;
    // } else {
    //   // aucune image dans le tableau => insertion
    //   const img = { spaCode: 1, image: file };
    //   this.selectedFiles = [...this.selectedFiles, img];
    // }
  }


  getRegions() {
    this.authService.getInscRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }



  getEducationTracks() {
    this.authService.getEducationalTracks().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.educationTracks = [...this.educationTracks, element];
      }
    });
  }

  getStudyLevels() {
    this.authService.getStudyLevels().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.studyLevels = [...this.studyLevels, element];
      }
    });
  }


  getDepartments() {
    this.depts = [];
    this.cities = [];
    if (!this.isMaintenancier) {
      this.regionId = this.userForm.value.regionId;
    }
    this.authService.getInscDeptsByRegionid(this.regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.depts = [...this.depts, element];
      }
    });
  }


  getCities() {
    this.cities = [];
    const departmentId = this.userForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.cities = [...this.cities, element];
      }
    });
  }

  getMaritalStatus() {
    this.authService.getMaritalStatus().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.maritalStatus = [...this.maritalStatus, element];
      }
    });
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

  saveUser() {
    this.waitDiv = true;
    const dataToSave = this.userForm.value;
    if (dataToSave.dateOfBirth) {
      dataToSave.dateOfBirth = Utils.inputDateDDMMYY(dataToSave.dateOfBirth, '/');
    }
    if (this.authService.loggedIn() === true) {
      this.authService.addUser(dataToSave, this.authService.decodedToken.nameid).subscribe((userid: number) => {
        if (userid && this.userPhotoUrl) {
          // enregistrement de la photo
          this.addPhoto(userid);
        } else {
          this.alertify.success('enregistrement terminé...');
          this.userForm.reset();
          if (this.isMaintenancier) {
            // this.getDepartments();
            this.createUserForms();
          } else {
            this.getRegions();

          }
          this.waitDiv = false;
        }
      });
    } else {
      this.authService.savePreInscription(dataToSave).subscribe((userid: number) => {
        if (userid && this.userPhotoUrl) {
          // enregistrement de la photo
          this.addPhoto(userid);
        } else {
          this.alertify.success('enregistrement terminé...');
          this.userForm.reset();
          this.waitDiv = false;
        }
      });
    }




  }

  addPhoto(userId) {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.authService.addUserPhoto(userId, formData).subscribe(() => {
      this.userPhotoUrl = '';
      this.alertify.success('enregistrement terminé...');
      this.userForm.reset();
      this.waitDiv = false;
    }, error => {
      console.log(error);
      this.waitDiv = false;
    });
  }



}
