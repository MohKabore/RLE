import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Region } from 'src/app/_models/region';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.scss']
})
export class RegistrationDetailsComponent implements OnInit {
  searchForm: FormGroup;
  region: Region;
  showRegions = false;
  showDetails = false;
  show = false;
  regions: any = [];
  noResult ='';
  regionId: number;

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
  }


  createSearchForms() {
    this.searchForm = this.fb.group({
      regionId: [null],
    });
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

    this.userService.regionOpDetails(this.regionId).subscribe((res: Region) => {
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
