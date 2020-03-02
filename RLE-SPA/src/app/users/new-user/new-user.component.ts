import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';



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
  searchForm: FormGroup;
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
  importedUsers: any = [];
  showExport = false;
  headElements = ['#', 'nom', 'Prenoms', 'Contact 1', 'Contact 2', 'Email'];
  isSelected: any = [];



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

  select(e) {
    const idx = this.isSelected.indexOf(e);
    if (idx === -1) {
      this.isSelected = [...this.isSelected, e];
    } else {
      this.isSelected.splice(idx);
    }
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

  getExportDepartments() {
    this.depts = [];
    this.cities = [];
    if (!this.isMaintenancier) {
      this.regionId = this.searchForm.value.regionId;
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

  getExportCities() {
    this.cities = [];
    const departmentId = this.searchForm.value.departmentId;
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
  saveImportedUsers() {
    if (confirm('voulez-vous vraiment enregistrer ses informations?')) {
      this.waitDiv = true;
      const dataToSave = this.importedUsers.filter(s => s.selected === true);
      const formData = this.searchForm.value;
      for (let i = 0; i < dataToSave.length; i++) {
        const element = dataToSave[i];
        element.typeEmpId = formData.typeEmpId;
        element.regionId = formData.regionId;
        element.departmentId = formData.departmentId;
        element.resCityId = formData.resCityId;
      }
      this.authService.addImportedUsers(dataToSave, this.authService.decodedToken.nameid).subscribe((userid: number) => {
        this.alertify.success('enregistrement terminé...');
        this.importedUsers = this.importedUsers.filter(a => a.selected === false);
        this.isSelected = [];
        this.userForm.reset();
        if (this.isMaintenancier) {
          // this.getDepartments();
          this.createUserForms();
        } else {
          this.getRegions();

        }
        this.waitDiv = false;
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

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.importedUsers = [];
      const d = jsonData;
      // debugger;
      for (let i = 0; i < d.at.length; i++) {
        const la_ligne = d.at[i];
        const element: any = {};
        element.lastName = la_ligne.nom;
        element.firstName = la_ligne.prenoms,
          element.phoneNumber = la_ligne.contact1,
          element.secondPhoneNumber = la_ligne.contact2,
          element.email = la_ligne.email;
        element.selected = false;

        this.importedUsers = [...this.importedUsers, element];
      }
      this.showExport = true;
      if (this.authService.isMaintenancier()) {
        this.getDepartments();
      } else {
        this.getRegions();
      }
      this.createSearchForms();

      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  createSearchForms() {
    this.searchForm = this.fb.group({
      resCityId: [null, Validators.required],
      departmentId: [null, Validators.required],
      regionId: [this.regionId],
      typeEmpId: [null, Validators.required],
      empName: ['']
    });
  }

  cancel() {
    this.showExport = false;
    this.isSelected = [];
  }


}