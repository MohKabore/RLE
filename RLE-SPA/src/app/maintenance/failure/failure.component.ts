import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { MDBDatePickerComponent, ClockPickerComponent } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})
export class FailureComponent implements OnInit {
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('datePicker', { static: true }) datePicker: MDBDatePickerComponent;
  @ViewChild('timePicker', { static: true }) timePicker: ClockPickerComponent;
  failureForm: FormGroup;

  hotliners: any[] = [];
  faliureList: any[] = [];
  repairAction: any[] = [];
  maints: any[] = [];
  tablets: any[] = [];
  regions: any[] = [];
  tabletId: number;
  noResult = '';
  showMaintDiv = false;
  myDatePickerOptions = Utils.myDatePickerOptions;
  currentUserId: number;


  constructor(private fb: FormBuilder, private userService: UserService,
    private stockService: StockService, private router: Router, private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.getHotliners();
    this.createFailureForm();
    this.getFailureList();
    this.getRepairAction();
    this.getRegions();
  }

  getRegions() {
    this.authService.getRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
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
  
  getSelectedMaints() {
    const departmentId = this.failureForm.value.regionId;
    this.maints = [];
    this.userService.getSelectedMaintsByRegionId(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].lastName + ' ' + res[i].firstName };
        this.maints = [...this.maints, element];
      }
    }, error => {
      console.log(error);
    });
  }

  createFailureForm() {
    this.failureForm = this.fb.group({
      hotliner1Id: [null, Validators.required],
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
      joined: [false, Validators.required],
      imei: ['', Validators.required],
      failureList1Id: [null, Validators.required],
      repairAction1Id: [null, Validators.required],
      repaired: [null, Validators.required],
      fieldTech1Id: [null],
      note1: [''],
      regionId: [null, Validators.required]

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
  getRegionData() {
    this.getSelectedMaints();
    //  this.getDeptTablets();
  }

  getDeptTablets() {
    const departmentId = this.failureForm.value.departmentId;
    this.tablets = [];
    this.stockService.getDeptTablets(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        if (element.employeeId) {
          const ele = { value: element.id, label: element.imei + ' (' + 'opérateur ' + element.empName + ')' };
          this.tablets = [...this.tablets, ele];
        }

        if (element.storeId) {
          const ele = { value: element.id, label: element.imei + ' (' + element.storeName + ')' };
          this.tablets = [...this.tablets, ele];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  verifyImei() {

    const imei = this.failureForm.value.imei;
    this.noResult = '';
    this.tabletId = null;
    if (imei.length === 5) {

      this.stockService.getTabletByImei(imei).subscribe((tablet: any) => {
        if (tablet === 0) {
          this.noResult = 'imei non trouvé...';
        } else if (tablet.status === 0) {
          this.noResult = 'tablette déjà en panne...';
        } else {
          this.tabletId = tablet.id;
        }
      }, error => {
        console.log(error);
      });
    }

  }

  hide() {
    this.showMaintDiv = false;
  }

  show() {
    this.showMaintDiv = true;
  }
  save() {
    const formData = this.failureForm.value;
    const startDateData = this.failureForm.value.startDate.split('/');
    const startTimeDate = this.failureForm.value.startTime.split(':');
    formData.failureDate = new Date(startDateData[2], startDateData[1] - 1,
      startDateData[0], startTimeDate[0], startTimeDate[1]);
    formData.tabletId = this.tabletId;
    this.stockService.saveFailure(this.currentUserId, formData).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.failureForm.reset();
      this.tabletId = null;
      this.noResult = '';

    }, error => {
      this.router.navigate(['/error']);
    });
  }



}
