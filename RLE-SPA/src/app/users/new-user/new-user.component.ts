import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { debounceTime } from 'rxjs/operators';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';



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
  @Output() cancelEdition = new EventEmitter<any>();
  @Output() endUpdate = new EventEmitter<any>();
  @Output() photoChange = new EventEmitter<any>();

  searchForm: FormGroup;
  @Input() user: any;
  regions: any = [];
  depts: any = [];
  cities: any = [];
  typeEmps: any = [];
  studyLevels: any = [];
  educationTracks: any = [];
  maritalStatus: any = [];
  waitDiv = false;
  editionMode;
  waitForValidation = true;
  userPhotoUrl = '';
  readyforImport: boolean;
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
  filteredUsers: any = [];
  showExport = false;
  headElements = ['#', 'nom', 'Prenoms', 'Contact 1', 'Contact 2', 'Email'];
  isSelected: any = [];
  searchControl: FormControl = new FormControl();
  formModel;
  currentUserId: number;




  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    if (this.user) {
      this.editionMode = 'edit';
      this.userPhotoUrl = this.user.photoUrl;
      this.formModel = this.user;
      this.currentUserId = this.user.id;
      // this.getDepartments();
      // this.getCities();
    } else {
      this.editionMode = 'add';
      this.initializeFormModel();
    }

    if (this.authService.isMaintenancier()) {
      this.regionId = Number(this.authService.currentUser.regionId);
      this.isMaintenancier = true;
      this.getDepartments();
      if (this.editionMode === 'edit') {
        this.getCities();
      }
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
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      this.filerData(value);
    });
  }

  initializeFormModel() {
    this.formModel = {
      lastName: '',
      firstName: '',
      gender: null,
      dateOfBirth: '',
      resCityId: null,
      departmentId: null,
      regionId: this.regionId,
      typeEmpId: null,
      maritalStatusId: null,
      educationalTrackId: null,
      studyLevelId: null,
      phoneNumber: '',
      secondPhoneNumber: '',
      birthPlace: '',
      nbChild: null,
      email: '',
      cni: '',
      passport: '',
      iddoc: ''
    }

  }

  createUserForms() {
    this.userForm = this.fb.group({
      lastName: [this.formModel.lastName, Validators.required],
      firstName: [this.formModel.firstName, Validators.required],
      gender: [this.formModel.gender, Validators.required],
      dateOfBirth: [this.formModel.dateOfBirth],
      resCityId: [this.formModel.resCityId],
      departmentId: [this.formModel.departmentId, Validators.required],
      regionId: [this.regionId, Validators.required],
      typeEmpId: [this.formModel.typeEmpId, Validators.required],
      maritalStatusId: [this.formModel.maritalStatusId],
      educationalTrackId: [this.formModel.educationalTrackId],
      studyLevelId: [this.formModel.studyLevelId],
      phoneNumber: [this.formModel.phoneNumber, Validators.required],
      secondPhoneNumber: [this.formModel.secondPhoneNumber],
      birthPlace: [this.formModel.birthPlace],
      nbChild: [this.formModel.nbChild],
      email: [this.formModel.email, [Validators.email]],
      cni: [this.formModel.cni],
      passport: [this.formModel.passport],
      iddoc: [this.formModel.iddoc]
    });
  }

  select(e) {
    const idx = this.isSelected.findIndex(a => a === e);
    if (idx === -1) {
      this.isSelected = [...this.isSelected, e];
    } else {
      this.isSelected.splice(idx, 1);
    }
  }

  verifyIfExist() {

    if (this.editionMode === 'add') {
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
    if (this.editionMode === 'edit') {
      // enrgistrement de la photo
      this.addPhoto(this.currentUserId);
    }
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
    let departmentId: number;
    if (this.editionMode === 'add') {
      departmentId = this.userForm.value.departmentId;
    } else {
      departmentId = this.user.departmentId;
    }
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

    if (this.editionMode === 'add') {
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
            this.userPhotoUrl = '';
            this.alertify.success('enregistrement terminé...');
            this.userForm.reset();
            this.waitDiv = false;
          } else {
            this.alertify.success('enregistrement terminé...');
            this.userForm.reset();
            this.waitDiv = false;
          }
        });
      }
    } else {
      this.updateuser(dataToSave);
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
        element.gender = 1;
      }
      this.authService.addImportedUsers(dataToSave, this.authService.decodedToken.nameid).subscribe((userid: number) => {
        this.alertify.success('enregistrement terminé...');
        this.importedUsers = this.importedUsers.filter(a => a.selected === false);
        this.filteredUsers = this.importedUsers;
        // this.searchForm.reset();
        // this.searchForm.setValue(null);
        this.isSelected = [];
        // this.userForm.reset();
        this.searchForm.controls['resCityId'].setValue(null);

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

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.filteredUsers = [...this.importedUsers];
    }
    const columns = Object.keys(this.importedUsers[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.importedUsers.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.filteredUsers = rows;
  }


  updateuser(user: any) {
    this.userService.updateUserInformations(this.currentUserId, user).subscribe(() => {
      this.endUpdate.emit(this.currentUserId);
      this.alertify.success('modification enregistrée...');
    }, error => {
      this.router.navigate(['error']);
    });
  }



  addPhoto(userId): any {
    if(this.editionMode==='edit') {
      this.waitDiv = true;
    }
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.authService.addUserPhoto(userId, formData).subscribe((res: any) => {
      if (this.editionMode === 'edit') {
        if (this.currentUserId === this.authService.currentUser.id) {
          this.authService.changeUserPhoto(res.photoUrl);
          this.waitDiv = false;
        }
        this.photoChange.emit(res.photoUrl);

        this.alertify.success('nouvelle photo enregistrée....');
      }
    });
    // , error => {
    //   console.log(error);
    //   if (this.editionMode === 'edit') {
    //     this.alertify.error('impossible d\'enregistrer la nouvelle photo....');
    //     console.log(error);
    //   }
    //   // this.waitDiv = false;
    // }
  }

  onFileChange(ev) {
    this.readyforImport = true;
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
      this.filteredUsers = [];
      const d = jsonData;
      for (let i = 0; i < d.at.length; i++) {
        const la_ligne = d.at[i];
        const element: any = {};
        element.lastName = la_ligne.nom;
        element.firstName = la_ligne.prenoms,
          element.phoneNumber = la_ligne.contact1,
          element.secondPhoneNumber = la_ligne.contact2,
          element.email = la_ligne.email;
        element.selected = false;
        if (!la_ligne.nom || !la_ligne.prenoms || !la_ligne.contact1) {
          this.readyforImport = false;
        }

        this.importedUsers = [...this.importedUsers, element];
      }
      this.filteredUsers = this.importedUsers;
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

  returnToList() {
    this.cancelEdition.emit(true);
  }

}