import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Region } from 'src/app/_models/region';
import { UserService } from 'src/app/_services/user.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.scss']
})
export class RegistrationDetailsComponent implements OnInit {
  searchForm: FormGroup;
  searchBydateForm: FormGroup;
  region: any;
  showRegions = false;
  showDetails = false;
  showTrainings = false;
  show = false;
  regions: any = [];
  trainings: any = [] = [];
  recap: any;
  noResult = '';
  noTraining = '';
  regionId: number;
  myDatePickerOptions = Utils.myDatePickerOptions;


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    if (!this.authService.isMaintenancier()) {
      this.getRegions();
      this.showRegions = true;
      this.createSearchForms();
    } else {
      this.regionId = this.authService.currentUser.regionId;
      this.getDetails();
    }
    this.createSearchByDateForm();
  }
  createSearchByDateForm() {
    this.searchBydateForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }


  createSearchForms() {
    this.searchForm = this.fb.group({
      regionId: [null],
    });
  }

  reset() {
    this.createSearchByDateForm();
  }

  searchTrainings() {
    this.recap = {};
    this.trainings = [];
    this.noTraining = '';
    this.showTrainings = false;
    let formData: any;
    formData = this.searchBydateForm.value;
    this.showTrainings = false;
    if (formData.startDate) {
      formData.startDate = Utils.inputDateDDMMYY(formData.startDate, '/');
    }

    if (formData.endDate) {
      formData.endDate = Utils.inputDateDDMMYY(formData.endDate, '/');
    }
    this.userService.getTrainings(formData).subscribe((res: any) => {
      if (res.trainings.length > 0) {
        this.recap = res.recap;
        this.trainings = res.trainings;
        this.showTrainings = true;
      } else {
        this.noTraining = 'Aucune formation trouvée....';
      }

    });
    this.createSearchByDateForm();

  }


  getRegions() {
    this.authService.getRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }

  getDetails() {
    this.showDetails = true;
    this.noResult = '';
    this.show = false;
    if (!this.authService.isMaintenancier()) {
      this.regionId = this.searchForm.value.regionId;
    }

    //  this.userService.regionOpDetails(this.regionId).subscribe((res: Region) => {
    this.userService.regionTrainingDetails(this.regionId).subscribe((res: any) => {
      if (res != null) {
        this.region = res;
        this.show = true;
      } else {
        this.noResult = 'aucune information trouvée dans cette région...';
      }
    }, error => {
      console.log(error);
    });


  }

}
