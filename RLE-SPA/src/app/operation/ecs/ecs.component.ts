import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { OperationService } from 'src/app/_services/operation.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { EnrolmentCenter } from 'src/app/_models/enrolmentCenter';

@Component({
  selector: 'app-ecs',
  templateUrl: './ecs.component.html',
  styleUrls: ['./ecs.component.scss']
})
export class EcsComponent implements OnInit {
  serachForm: FormGroup;
  codeSearchForm: FormGroup;
  ecForm: FormGroup;
  regions: any = [];
  ecregions: any = [];
  depts: any = [];
  ecdepts: any = [];
  cities: any = [];
  eccities: any = [];
  muns: any = [];
  ecmuns: any = [];
  ecs: any = [];
  editionMode = 'add';
  showEcs = false;
  showEc = false;
  currentUserId;
  ecId: number;
  ecCodeMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  ecCode: string;
  enrolCenter: EnrolmentCenter;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private opService: OperationService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.getRegions();
    this.createAffectationForms();
    this.createEcForms(null);
  }


  createAffectationForms() {
    this.serachForm = this.fb.group({
      cityId: [null, Validators.required],
      departmentId: [null, Validators.required],
      regionId: [null, Validators.required],
      municipalityId: [null, Validators.required]
    });
  }

  createEcForms(val) {
    let ecModel: any;
    this.ecdepts = [];
    this.eccities = [];
    this.ecmuns = [];
    this.getECRegions();

    if (val !== null) {
      this.editionMode = 'edit';
      this.ecId = val.id;
      ecModel = {
        cityId: val.municipality.cityId,
        departmentId: val.municipality.city.departmentId,
        regionId: val.municipality.city.department.regionId,
        municipalityId: val.municipalityId,
        name: val.name,
        code: val.code
      };
    } else {
      this.editionMode = 'add';
      ecModel = {
        cityId: null,
        departmentId: null,
        regionId: null,
        municipalityId: null,
        name: '',
        code: ''
      };
    }


    this.ecForm = this.fb.group({
      cityId: [ecModel.cityId, Validators.required],
      departmentId: [ecModel.departmentId, Validators.required],
      regionId: [ecModel.regionId, Validators.required],
      municipalityId: [ecModel.municipalityId, Validators.required],
      name: [ecModel.name, Validators.required],
      code: [ecModel.code, Validators.required]
    });

    if (val != null) {
      this.getECDepartments();
      this.getECCities();
      this.getECMuns();
    }
  }

  getRegions() {
    this.authService.getInscRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.regions = [...this.regions, element];
      }
    });
  }

  getDepartments() {
    this.depts = [];
    this.cities = [];
    this.ecs = [];
    this.muns = [];
    const regionId = this.serachForm.value.regionId;

    this.authService.getInscDeptsByRegionid(regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.depts = [...this.depts, element];
      }
    });
  }
  getCities() {
    this.cities = [];
    this.ecs = [];
    this.muns = [];
    const departmentId = this.serachForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.cities = [...this.cities, element];
      }
    });
  }

  getMuns() {
    this.muns = [];
    this.ecs = [];
    const cityId = this.serachForm.value.cityId;
    this.authService.getCityMunicipalities(cityId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.muns = [...this.muns, element];
      }
    });
  }


  getECRegions() {
    this.ecregions = [];
    this.authService.getInscRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.ecregions = [...this.ecregions, element];
      }
    });
  }

  getECDepartments() {
    this.ecdepts = [];
    this.eccities = [];
    this.ecmuns = [];
    const regionId = this.ecForm.value.regionId;

    this.authService.getInscDeptsByRegionid(regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.ecdepts = [...this.ecdepts, element];
      }
    });
  }
  getECCities() {
    this.eccities = [];
    this.ecmuns = [];
    const departmentId = this.ecForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.eccities = [...this.eccities, element];
      }
    });

  }

  getECMuns() {
    this.ecmuns = [];
    const cityId = this.ecForm.value.cityId;
    this.authService.getCityMunicipalities(cityId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.ecmuns = [...this.ecmuns, element];
      }
    });
  }

  getEcs() {
    this.showEcs = true;
    this.ecs = [];
    const municipaltyId = this.serachForm.value.municipalityId;
    this.authService.getMunEcs(municipaltyId).subscribe((res: any[]) => {
      this.ecs = res;
      console.log(res);
      // for (let i = 0; i < res.length; i++) {
      //   const element = { value: res[i].id, label: res[i].name + ' ' + res[i].displayCode };
      //   this.ecs = [...this.ecs, element];
      // }
    });
  }

  save() {
    const ecModel = this.ecForm.value;
    if (this.editionMode === 'edit') {
      this.opService.updateEnrolmentCenter(this.ecId, ecModel).subscribe(() => {
        this.alertify.success('enregistrement terminé...');
        this.getEcs();
      }, error => {
        console.log(error);
      });
    }
  }

  getEcByCode() {
    this.showEc = false;
    this.authService.getEcByCode(this.ecCode).subscribe((res: EnrolmentCenter) => {
      this.enrolCenter = res;
      this.showEc = true;
    }, error => {
      console.log(error);
    });
  }

}
