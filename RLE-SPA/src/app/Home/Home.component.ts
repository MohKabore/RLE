import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Region } from '../_models/region';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services/user.service';
import { Department } from '../_models/department';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  regions: Region[];
  region: any = {};
  regionList: any = [];
  showDetails = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getRegionsData();
  }

  getRegionsData() {
    this.userService.getAllRegionsOpDetails().subscribe((res) => {
      this.regions = res;
    }, error => {
      console.log(error);
    });
  }
  // getDetails(params) {
  //   // this.region = {};
  //   this.userService.regionOpDetails(params.id).subscribe((res: Department[]) => {
  //     this.region.departments = res;
  //     this.region.name = params.name;
  //     this.showDetails = true;
  //     console.log(this.region);

  //   }, error => {
  //     console.log(error);
  //   }
  //   );
  // }

}
