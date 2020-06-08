import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-mun-detail',
  templateUrl: './mun-detail.component.html',
  styleUrls: ['./mun-detail.component.scss']
})
export class MunDetailComponent implements OnInit {
  affectationForm: FormGroup;
  munForm: FormGroup;
  regions: any = [];
  depts: any = [];
  cities: any = [];
  muns: any = [];
  show = false;
  noResult = '';


  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.createaffectationForms();
    this.createMunForm();
    this.getRegions();
  }

  createaffectationForms() {
    this.affectationForm = this.fb.group({
      resCityId: [null, Validators.required],
      regionId: [null, Validators.required],
      departmentId: [null, Validators.required],
      municipalityId: [null, Validators.required]
    });
  }

  createMunForm() {
    this.munForm = this.fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required]
    });
  }

  getRegions() {
    this.authService.getInscRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }

  getAffectationCities() {
    this.cities = [];
    this.muns = [];
    const departmentId = this.affectationForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.cities = [...this.cities, element];
      }
    });
  }

  getMuns() {
    this.muns = [];
    this.noResult = '';
    this.show = false;
    const cityId = this.affectationForm.value.resCityId;
    this.authService.getCityMunicipalities(cityId).subscribe((res: any[]) => {
      if (res.length === 0 || res === null) {
        this.noResult = 'Aucune commune trouvée...';
      } else {
        this.muns = res;
      }

      this.show = true;
    }, error => {
      console.log(error);
    });
  }

  cancel() {

  }

  getDepartments() {
    this.depts = [];
    this.cities = [];
    this.authService.getInscDeptsByRegionid(this.affectationForm.value.regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.depts = [...this.depts, element];
      }
      
    });
  }

  saveMuncipilaty() {
    const mun = this.munForm.value;
    // mun.code = this.munForm.value.code;
    // mun.name = this.munForm.value.name;
    mun.cityId = this.affectationForm.value.resCityId;
    this.userService.createMunicipality(mun).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.getMuns();
    }, error => {
      console.log(error);
    });
  }


}
