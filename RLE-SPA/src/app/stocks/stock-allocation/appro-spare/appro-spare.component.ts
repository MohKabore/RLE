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
  selector: 'app-appro-spare',
  templateUrl: './appro-spare.component.html',
  styleUrls: ['./appro-spare.component.scss']
})
export class ApproSpareComponent implements OnInit {

  myDatePickerOptions = Utils.myDatePickerOptions;
  stockForm: FormGroup;
  searchForm: FormGroup;
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
  tablet: any;

  stores = environment.mainStores;
  cieStoreId = environment.ceiStoreId;
  constructor(private fb: FormBuilder, private router: Router, private userService: UserService,
    private stockService: StockService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.createStockForm();
    this.createSearchForm();
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
      fromStoreId: [null, Validators.required],
      regionId: [null, Validators.required],
      toEmployeeId: [null, Validators.required]

    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      imei: ['']
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

  clearImei() {
    this.searchForm.reset();
  }

  verifyImei() {

    this.noResult = '';
    this.tablet = null;
    const storeId = this.stockForm.value.fromStoreId;
    const imei = this.searchForm.value.imei;
    if (imei.length === 5) {

      this.stockService.getStoreTabletByImei(storeId, imei).subscribe((tablet: any) => {
        if (tablet === null) {
          this.noResult = 'imei non trouvé...';
        } else if (tablet.status === 0) {
          this.noResult = 'tablette déjà en panne...';
        } else {
          this.tablet = tablet;
        }
      }, error => {
        console.log(error);
      });
    }

  }

  add() {
    this.tablets = [...this.tablets, this.tablet];
    this.searchForm.controls['imei'].setValue('');
    this.tablet = null;
    this.noResult = '';
    // console.table(this.tablets);

  }

  getSourceTablets() {
    // this.showTablets = true;
    // this.noResult = '';
    // const fromStoreId = this.stockForm.value.fromStoreId;
    // this.tablets = [];
    // this.stockService.getStoreTablets(fromStoreId).subscribe((res: any[]) => {
    //   if (res.length > 0) {
    //     for (let i = 0; i < res.length; i++) {
    //       const element = { value: res[i].id, label: res[i].imei };
    //       this.tablets = [...this.tablets, element];
    //     }
    //     // this.filteredTablets = this.tablets;
    //     // this.filteredTablets = res;
    //   } else {
    //     this.noResult = 'aucune tablette trouvée...';
    //   }
    // }, error => {
    //   console.log(error);
    // });
  }

  save() {
    const formData = this.stockForm.value;
    let tIds: number[]=[];
    for (let index = 0; index < this.tablets.length; index++) {
      const eltId = this.tablets[index].id;
      tIds = [...tIds, eltId];
    }
    formData.tabletIds = tIds;
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
