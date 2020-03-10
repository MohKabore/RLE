import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { Utils } from 'src/app/shared/utils';
import { OperationService } from 'src/app/_services/operation.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {
  affectationForm: FormGroup;
  regions: any = [];
  depts: any = [];
  cities: any = [];
  muns: any = [];
  ecs: any = [];
  tablets: any = [];
  currentUserId;
  ops: any = [];
  myDatePickerOptions = Utils.myDatePickerOptions;


  constructor(private fb: FormBuilder, private authService: AuthService, private opService: OperationService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.getRegions();
    this.createAffectationForms();
  }

  createAffectationForms() {
    this.affectationForm = this.fb.group({
      cityId: [null, Validators.required],
      departmentId: [null, Validators.required],
      regionId: ['', Validators.required],
      municipalityId: ['', Validators.required],
      enrolmentCenterId: ['', Validators.required],
      tabletId: ['', Validators.required],
      employeeId: ['', Validators.required],
      opDate: ['', Validators.required]
    });
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
    this.ops = [];
    this.tablets = [];

    const regionId = this.affectationForm.value.regionId;

    this.authService.getInscDeptsByRegionid(regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.depts = [...this.depts, element];
      }
    });
  }
  getCities() {
    this.cities = [];
    this.tablets = [];
    this.ecs = [];
    this.muns = [];
    this.ops = [];
    const departmentId = this.affectationForm.value.departmentId;
    this.authService.getInscCitiesByDeptid(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.cities = [...this.cities, element];
      }
    });

    this.authService.getDeptCeiTablets(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].imei };
        this.tablets = [...this.tablets, element];
      }
    });

  }

  getMuns() {
    this.muns = [];
    this.ops = [];
    this.ecs = [];
    this.ops = [];
    const cityId = this.affectationForm.value.cityId;
    this.authService.getCityMunicipalities(cityId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' - ' + res[i].code };
        this.muns = [...this.muns, element];
      }
    });

    this.authService.getCitySelectedEmps(cityId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].lastName + ' - ' + res[i].firstName };
        this.ops = [...this.ops, element];
      }
    });
  }

  getEcs() {
    this.ecs = [];
    const municipaltyId = this.affectationForm.value.municipalityId;
    this.authService.getMunEcs(municipaltyId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name + ' ' + res[i].displayCode };
        this.ecs = [...this.ecs, element];
      }
    });
  }


  save() {
    const formData = this.affectationForm.value;
    formData.mvtDate = Utils.inputDateDDMMYY(formData.opDate, '/');
    this.opService.affectOp(this.currentUserId, formData).subscribe(() => {
      this.affectationForm.reset();
      this.alertify.success('enregistrement terminé...');
    });
  }

}
