import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-back-tablet',
  templateUrl: './back-tablet.component.html',
  styleUrls: ['./back-tablet.component.scss']
})
export class BackTabletComponent implements OnInit {
  myDatePickerOptions = Utils.myDatePickerOptions;
  stockForm: FormGroup;
  tablets: any = [];
  filteredTablets: any = [];
  currentUserId;
  showTablets = false;
  wait = false;
  waitForValidation = false;
  regions: any = [];
  maints: any = [];
  tabletIds: any[] = [];
  employees: any = [];
  departments: any = [];
  noResult = '';
  searchControl: FormControl = new FormControl();
  step = 0;
  currentStep = 0;
  currentIds = [];

  stores = environment.mainStores;
  cieStoreId = environment.ceiStoreId;
  constructor(private fb: FormBuilder, private router: Router, private userService: UserService,
    private stockService: StockService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.createStockForm();
    this.currentUserId = this.authService.currentUser.id;
    this.getRegions();
    // this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
    //   this.filerData(value);
    // });

    // this.stockForm.get('tabletIds').valueChanges.subscribe((value) => {
    //   // console.log('Selected values:', value);
    //   this.currentIds = value;
    // });
  }

  // filerData(val) {
  //   if (val) {
  //     val = val.toLowerCase();
  //   } else {
  //     for (let i = 0; i < this.currentIds.length; i++) {
  //       const element = this.currentIds[i];
  //       this.tabletIds = [...this.tabletIds, element];
  //     }
  //     return this.filteredTablets = [...this.tablets];
  //   }
  //   const columns = Object.keys(this.tablets[0]);
  //   if (!columns.length) {
  //     return;
  //   }

  //   const rows = this.tablets.filter(function (d) {
  //     for (let i = 0; i <= columns.length; i++) {
  //       const column = columns[i];
  //       if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
  //         return true;
  //       }
  //     }
  //   });
  //   this.filteredTablets = rows;
  // }

  recap() {
    this.waitForValidation = true;
    this.tabletIds = [];
    for (let i = 0; i < this.stockForm.value.tabletIds.length; i++) {
      const tabletid = this.stockForm.value.tabletIds[i];
      this.tabletIds = [...this.tabletIds, tabletid];
      const tablet = this.tablets.find(v => Number(v.value) === Number(tabletid));
      this.filteredTablets = [...this.filteredTablets, tablet];
    }
    this.waitForValidation = false;
  }

  createStockForm() {
    this.stockForm = this.fb.group({
      refNum: [''],
      mvtDate: [null, Validators.required],
      toStoreId: [null, Validators.required],
      regionId: [null, Validators.required],
      fromEmployeeId: [null, Validators.required],
      tabletIds: [null, Validators.required]

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

  getSelectedMaints() {
    const regionId = this.stockForm.value.regionId;
    this.maints = [];
    this.userService.getSelectedMaintsByRegionId(regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].lastName + ' ' + res[i].firstName };
        this.maints = [...this.maints, element];
      }
    }, error => {
      console.log(error);
    });
  }


  getSourceTablets() {
    this.showTablets = true;
    this.noResult = '';
    const fromEmployeeId = this.stockForm.value.fromEmployeeId;
    this.tablets = [];
    this.stockService.getMaintainerTablets(fromEmployeeId).subscribe((res: any[]) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].imei };
          this.tablets = [...this.tablets, element];
        }
        // this.filteredTablets = this.tablets;
        // this.filteredTablets = res;
      } else {
        this.noResult = 'aucune tablette trouvée...';
      }
    }, error => {
      console.log(error);
    });
  }

  save() {
    const formData = this.stockForm.value;
    formData.tabletIds = this.tabletIds;
    formData.mvtDate = Utils.inputDateDDMMYY(formData.mvtDate, '/');
    this.stockService.saveApproSphare(this.currentUserId, formData).subscribe((res) => {
      this.alertify.success('enregistrement terminé...');
      this.stockForm.reset();
      this.tabletIds = [];
      this.showTablets = false;
      this.filteredTablets = [];
      this.tablets = [];
    }, error => {
      this.router.navigate(['error']);
    });

  }

}
