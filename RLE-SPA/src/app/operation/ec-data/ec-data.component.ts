import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { StockService } from 'src/app/_services/stock.service';
import { Utils } from 'src/app/shared/utils';
import { MDBDatePickerComponent, ClockPickerComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-ec-data',
  templateUrl: './ec-data.component.html',
  styleUrls: ['./ec-data.component.scss']
})
export class EcDataComponent implements OnInit {
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('datePicker', { static: true }) datePicker: MDBDatePickerComponent;
  @ViewChild('timePicker', { static: true }) timePicker: ClockPickerComponent;
  ecDataForm: FormGroup;


  regions: any[] = [];
  tablet: any;
  noResult = '';
  showMaintDiv = false;
  myDatePickerOptions = Utils.myDatePickerOptions;
  currentUserId: number;
  wait = false;


  constructor(private fb: FormBuilder, private stockService: StockService, private router: Router, private alertify: AlertifyService, private authService: AuthService) { }


  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.createEcDataForm();
    this.getRegions();
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

  getRegions() {
    this.authService.getRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }

  verifyImei() {

    const imei = this.ecDataForm.value.imei;
    this.noResult = '';
    this.tablet = null;
    if (imei.length === 5) {

      this.stockService.getTabletByImei(imei).subscribe((tablet: any) => {
        if (tablet === null) {
          this.noResult = 'imei non trouvé...';
          this.alertify.error(this.noResult);
        } else {
          this.tablet = tablet;
          this.alertify.success('imei correcte');

        }
      }, error => {
        console.log(error);
      });
    }

  }

  createEcDataForm() {
    this.ecDataForm = this.fb.group({
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
       imei: ['', Validators.required],
      cat1: [null, Validators.required],
      cat2: [null, Validators.required],
      regionId: [null, Validators.required]
    });
  }

  save() {
    this.wait = true;
    const formData = this.ecDataForm.value;
    const startDateData = this.ecDataForm.value.startDate.split('/');
    const startTimeDate = this.ecDataForm.value.startTime.split(':');
    formData.opDate = new Date(startDateData[2], startDateData[1] - 1,
      startDateData[0], startTimeDate[0], startTimeDate[1]);
    formData.tabletId = this.tablet.id;
    this.stockService.saveEcData(this.currentUserId, formData).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.ecDataForm.reset();
      this.tablet = null;
      this.noResult = '';
      this.wait = false;

    }, error => {
      this.router.navigate(['/error']);
    });
  }



}
