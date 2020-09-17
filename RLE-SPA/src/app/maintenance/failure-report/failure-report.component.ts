import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { StockService } from 'src/app/_services/stock.service';
import { UserService } from 'src/app/_services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDBDatePickerComponent, ClockPickerComponent } from 'ng-uikit-pro-standard';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-failure-report',
  templateUrl: './failure-report.component.html',
  styleUrls: ['./failure-report.component.scss']
})
export class FailureReportComponent implements OnInit {

  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('datePicker', { static: true }) datePicker: MDBDatePickerComponent;
  @ViewChild('timePicker', { static: true }) timePicker: ClockPickerComponent;
  failureForm: FormGroup;
  myDatePickerOptions = Utils.myDatePickerOptions;

  currentUserId: number;
  failureId: number;
  failure: any;
  maints: any[] = [];
  hotliners: any[] = [];
  faliureList: any[] = [];
  tablets: any[];
  repairAction: any[] = [];
  tabletExId: number;
  noResult = '';
  allTablets: any[];
  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private stockService: StockService, private route: ActivatedRoute, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.currentUserId = this.authService.decodedToken.nameid;
    this.tabletExId = null;
    this.route.params.subscribe(params => {
      this.failureId = params.id;
      this.gatFailureDetails();
    });

    this.getHotliners();
    this.createFailureForm();
    this.getFailureList();
    this.getRepairAction();
  }

  gatFailureDetails() {
    this.stockService.getFailure(this.failureId).subscribe((res: any) => {
      if (res !== null) {
        this.failure = res;
        this.getSelectedMaints();
      }
      console.log(res);
    });
  }

  getSelectedMaints() {
    this.userService.getSelectedMaintsByRegionId(this.failure.regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].lastName + ' ' + res[i].firstName };
        this.maints = [...this.maints, element];
      }
    }, error => {
      console.log(error);
    });
  }

  getHotliners() {
    this.userService.getHotliners().subscribe((res: any[]) => {
      for (let index = 0; index < res.length; index++) {
        const element = { value: res[index].id, label: res[index].lastName + ' ' + res[index].firstName };
        this.hotliners = [...this.hotliners, element];
      }
    });
  }

  getFailureList() {
    this.authService.failureList().subscribe((res: any[]) => {
      for (let index = 0; index < res.length; index++) {
        const element = { value: res[index].id, label: res[index].name };
        this.faliureList = [...this.faliureList, element];
      }
      // console.table(this.departments);
    });
  }

  getRepairAction() {
    this.authService.failureAction().subscribe((res: any[]) => {
      for (let index = 0; index < res.length; index++) {
        const element = { value: res[index].id, label: res[index].name };
        this.repairAction = [...this.repairAction, element];
      }
      // console.table(this.departments);
    });
  }

  createFailureForm() {
    this.failureForm = this.fb.group({
      hotliner2Id: [null, Validators.required],
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
      imei: [''],
      failureList2Id: [null, Validators.required],
      repairAction2Id: [null],
      tabletExId: [null],
      repaired: [null, Validators.required],
      fieldTech2Id: [null],
      note2: ['']
    });
  }

  onDateChange = (event: { actualDateFormatted: string; }) => {
    this.input.nativeElement.value = event.actualDateFormatted; // set value to input
    this.datePicker.closeBtnClicked(); // close date picker
    this.timePicker.openBtnClicked(); // open time picker
  }

  onTimeChange = (event: string) => {
    this.input.nativeElement.value = `${this.input.nativeElement.value}, ${event}`; // set value to input
    // this.stockForm.controls['mvtDate'].setValue(this.input.nativeElement.value);
  }

  getMaintTablets() {
    const maintenancierId = this.failureForm.value.fieldTech2Id;
    this.tablets = [];
    this.noResult = '';
    this.stockService.getMaintainerTablets(maintenancierId).subscribe((res: any[]) => {
      if (res.length >= 0) {
        for (let index = 0; index < res.length; index++) {
          const element = { value: res[index].id, label: res[index].imei };
          this.tablets = [...this.tablets, element];
        }
      } else {
        this.noResult = 'aucune tablette trouvée pour ce maintenancier';
      }
    }, error => {
      this.noResult = 'aucune tablette trouvée pour ce maintenancier';
    });
  }



  save() {
    const formData = this.failureForm.value;
    const startDateData = this.failureForm.value.startDate.split('/');
    const startTimeDate = this.failureForm.value.startTime.split(':');
    formData.maintDate = new Date(startDateData[2], startDateData[1] - 1,
      startDateData[0], startTimeDate[0], startTimeDate[1]);
    formData.tabletId = this.failure.tabletId;
    formData.tabletExId = this.tabletExId;
    this.stockService.saveMaintenance(this.failureId, this.currentUserId, formData).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.failureForm.reset();
      this.noResult = '';
      this.router.navigate(['/failures']);

    }, error => {
      this.router.navigate(['/error']);
    });
  }

  // verifyImei() {

  //   const imei = this.failureForm.value.imei;
  //   this.noResult = '';
  //   this.tabletExId = null;
  //   if (imei.length === 5) {

  //     this.stockService.getTabletByImei(imei).subscribe((tablet: any) => {
  //       if (tablet === null) {
  //         this.noResult = 'imei non trouvé...';
  //       } else if (tablet.status === 0) {
  //         this.noResult = 'tablette déjà en panne...';
  //       } else {
  //         this.tabletExId = tablet.id;
  //       }
  //     }, error => {
  //       console.log(error);
  //     });
  //   }

  // }

  verifyImei() {

    const imei = this.failureForm.value.imei;
    this.noResult = '';
    this.tablets = [];
    this.allTablets = [];
    this.tabletExId = null;
    if (imei.length === 5) {

      this.stockService.getTabletByImei(imei).subscribe((res: any) => {
        if (res.length === 0) {
          this.noResult = 'imei non trouvé...';
          this.alertify.error(this.noResult);
        } else {
          if (res.length === 1) {
            this.tabletExId = res[0].id;
            this.alertify.success('imei correcte');
          } else {
            this.allTablets = res;
            this.alertify.success('plusieurs tablettes trouvées');
            for (let index = 0; index < res.length; index++) {
              const element = { value: res[index].id, label: res[index].imei + '(' + res[index].tabletType.name + ')' };
              this.tablets = [...this.tablets, element];
            }
          }


        }


      }, error => {
        console.log(error);
      });
    }

  }
  selectTablet(tabletId) {
    this.tabletExId = null;
    this.noResult='';
    const tablet = this.allTablets.find(a => a.id === tabletId);
    if (tablet.status === 0) {
      this.alertify.error('tablette en panne');
      this.noResult='tablette en panne';
    } else {
     this.tabletExId = tabletId;
    }
  }
}
