import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Region } from 'src/app/_models/region';
import { City } from 'src/app/_models/city';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-localities',
  templateUrl: './registration-localities.component.html',
  styleUrls: ['./registration-localities.component.scss']
})
export class RegistrationLocalitiesComponent implements OnInit {

  regions: Region[] = [];
  city: City;
  cityForm: FormGroup;
  regionIdx: number;
  cityIdx: number;
  departmentIdx: number;
  show = false;

  // showList = false;
  constructor(private fb: FormBuilder, private userService: UserService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.getLocalities();
  }

  getLocalities() {
    this.userService.allRegions().subscribe((res: Region[]) => {
      this.regions = res;
    }, error => {
      console.log(error);
    });
  }
  updateRegion(r) {
    if (confirm('voulez-vous vraiment enregistrer les modification ?')) {
      this.userService.updateRegionState(r.id).subscribe(() => {
        this.alertify.success('enregistrement terminé...');
        r.activeforInscription = !r.activeforInscription;
      });
    }
  }
  updateDeparment(d) {
    if (confirm('voulez-vous vraiment enregistrer les modification ?')) {
      this.userService.updateDepartmentState(d.id).subscribe(() => {
        this.alertify.success('enregistrement terminé...');
        d.activeforInscription = !d.activeforInscription;
      });
    }
  }


  updateCityState(c) {
    if (confirm('voulez-vous vraiment enregistrer les modification ?')) {
      this.userService.updateCityState(c.id).subscribe(() => {
        this.alertify.success('enregistrement terminé...');
        c.activeforInscription = !c.activeforInscription;
      });
    }
  }


  editCity(param: City, regionIdx: number, departmentIdx: number, cityIdx: number) {
    this.show = true;
    this.city = param;
    this.createCityForms();
    this.departmentIdx = departmentIdx;
    this.regionIdx = regionIdx;
    this.cityIdx = cityIdx;
  }

  createCityForms() {
    this.cityForm = this.fb.group({
      nbEmpNeeded: [this.city.nbEmpNeeded, Validators.required]
    });
  }


  saveCity() {
    const cityToSave = this.cityForm.value;
    cityToSave.id = this.city.id;
    this.userService.updateCityQuota(this.city.id, cityToSave.nbEmpNeeded).subscribe(() => {

      this.regions[this.regionIdx].departments[this.departmentIdx].cities[this.cityIdx].nbEmpNeeded = cityToSave.nbEmpNeeded;
      const currentdeptCities = this.regions[this.regionIdx].departments[this.departmentIdx].cities;
      let currentdept = this.regions[this.regionIdx].departments[this.departmentIdx];
      currentdept.nbEmpNeeded = currentdeptCities.reduce((acc, curr) => acc + Number(curr.nbEmpNeeded), 0);

      const currentregDepts = this.regions[this.regionIdx].departments;
      let currentreg = this.regions[this.regionIdx];
      currentreg.nbEmpNeeded = currentregDepts.reduce((acc, curr) => acc + Number(curr.nbEmpNeeded), 0);

      // var toNumber = ['1', '2', '3', '4', '5'];
      // var sumNumber = toNumber.reduce((acc, cur) => acc + Number(cur), 0)
      // console.log(sumNumber);
      this.alertify.success('modification enrégistrée...');
    });

  }

}
