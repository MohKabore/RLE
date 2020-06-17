import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-op-handling',
  templateUrl: './op-handling.component.html',
  styleUrls: ['./op-handling.component.scss']
})
export class OpHandlingComponent implements OnInit {

  headElements = ['#', 'nom', 'Prenoms', 'Contact 1', 'Contact 2', 'Region', 'Department', 'Sous-Prefecture', 'Commune'];
  regions: any = [];
  typeEmps: any = [];
  depts: any = [];
  cities: any = [];
  affectationCities: any = [];
  regionId: number;
  isMaintenancier = false;
  showOps = false;
  wait = false;
  muns: any = [];
  searchControl: FormControl = new FormControl();
  searchForm: FormGroup;
  totalReserved: number;
  totalSelected: number;
  currentUserId: number;

  affectationForm: FormGroup;
  users = [];
  noResult = '';
  usersDiv = false;


  isSelected: any = [];
  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    if (this.authService.isMaintenancier()) {
      this.regionId = Number(this.authService.currentUser.regionId);
      this.isMaintenancier = true;
      this.getDepartments();
    }

    this.getRegions();
    this.createSearchForms();
    this.createaffectationForms();
    this.getTypeEmps();
  }

  select(e) {
    const idx = this.isSelected.findIndex(a => a === e);
    if (idx === -1) {
      this.isSelected = [...this.isSelected, e];
    } else {
      this.isSelected.splice(idx, 1);
    }
  }

  getRegions() {
    this.authService.getInscRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }

  getCities() {
    this.cities = [];
    const departmentId = this.searchForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.cities = [...this.cities, element];
      }
    });
  }

  getAffectationCities() {
    this.affectationCities = [];
    const departmentId = this.affectationForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.affectationCities = [...this.affectationCities, element];
      }
    });
  }

  getDepartments() {
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

  getMuns() {
    this.muns = [];
    const cityId = this.affectationForm.value.resCityId;
    this.authService.getCityMunicipalities(cityId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.muns = [...this.muns, element];
      }
    });
  }


  search() {

  }

  cancel() {
    this.usersDiv = false;
    this.isSelected = [];
  }

  reset() {
    this.searchForm.controls['resCityId'].setValue(null);
    this.searchForm.controls['typeEmpId'].setValue(null);
    this.cities = [];
  }


  createSearchForms() {
    this.searchForm = this.fb.group({
      resCityId: [null, Validators.required],
      departmentId: [null, Validators.required],
      regionId: [this.regionId],
      typeEmpId: [null, Validators.required]
    });
  }

  createaffectationForms() {
    this.affectationForm = this.fb.group({
      resCityId: [null, Validators.required],
      departmentId: [null, Validators.required],
      municipalityId: [null, Validators.required]


    });
  }

  getTypeEmps() {
    if (this.isMaintenancier) {
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

  searchEmp() {
    const searchValues = this.searchForm.value;
    searchValues.regionId = this.regionId;
    this.users = [];
    this.noResult = '';
    this.usersDiv = true;
    this.totalReserved = 0;
    this.totalSelected = 0;
    this.isSelected = [];
    // this.userService.searchPreSelectedEmps(searchValues).subscribe((res: User[]) => {
    this.userService.searchEmpToRelocate(searchValues).subscribe((res: User[]) => {
      if (res.length > 0) {
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          element.sel = false;
          if (element.selected === true) {
            this.totalSelected++;
          }

          if (element.reserved === true) {
            this.totalReserved++;
          }
        }
        this.users = res;
      } else {
        this.noResult = 'aucune personne trouvée...';
      }
    }, error => {
      console.log(error);
    });
  }

  reAssignOps() {
    this.wait = true;
    const cityid = this.affectationForm.value.resCityId;
    const departmentId = this.affectationForm.value.departmentId;
    const municipalityId = this.affectationForm.value.municipalityId;
    this.userService.reAssignOps(cityid, departmentId, municipalityId, this.isSelected).subscribe((res) => {
      this.alertify.success('enregistrement terminé...');
      this.affectationForm.controls['resCityId'].setValue(null);
      this.isSelected = [];
      this.searchEmp();
      this.wait = false;
    }, error => {
      this.router.navigate(['error']);
    });
  }
  remove() {
    this.wait = true;
    const cityid = this.affectationForm.value.resCityId;
    this.userService.deleteOps(this.isSelected).subscribe((res) => {
      this.isSelected = [];
      this.alertify.success('enregistrement terminé...');
      this.searchEmp();
      this.wait = false;
    }, error => {
      this.router.navigate(['error']);
    });
  }


  removeSelectedUsers() {
    if (confirm('confirmez-vous la désélection ??')) {
      this.userService.unSelectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.alertify.success('enregistrement terminé...');
        this.searchEmp();
      });
    }
  }

  selectUsers() {
    if (confirm('confirmez-vous la selection ??')) {
      this.userService.selectUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        this.alertify.success('enregistrement terminé...');
        this.searchEmp();
      });
    }
  }


  reserveUsers() {
    if (confirm('confirmez-vous la mise en reserve ??')) {
      this.userService.reserveUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        // this.searchEmp();
        this.alertify.success('enregistrement terminé...');
        this.searchEmp();
      });
    }
  }

  removeReservedUsers() {
    if (confirm('confirmez-vous la selection ??')) {
     // debugger;
      this.userService.unReserveUsers(this.isSelected, this.currentUserId).subscribe((res) => {
        this.alertify.success('enregistrement terminé...');
        this.searchEmp();
      });
    }
  }

}
