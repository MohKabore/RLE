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

  headElements = ['#', 'nom', 'Prenoms', 'Contact 1', 'Contact 2', 'Email', 'Region', 'Department', 'Sous-Prefecture'];
  regions: any = [];
  typeEmps: any = [];
  depts: any = [];
  cities: any = [];
  affectationCities: any = [];
  regionId: number;
  isMaintenancier = false;
  showOps = false;
  wait = false;
  searchControl: FormControl = new FormControl();
  searchForm: FormGroup;

  affectationForm: FormGroup;
  users = [];
  noResult = '';
  usersDiv = false;


  isSelected: any = [];
  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
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
      departmentId: [null, Validators.required]

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
    this.userService.searchPreSelectedEmps(searchValues).subscribe((res: User[]) => {
      if (res.length > 0) {
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
    this.userService.reAssignOps(cityid, departmentId, this.isSelected).subscribe((res) => {
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


}
