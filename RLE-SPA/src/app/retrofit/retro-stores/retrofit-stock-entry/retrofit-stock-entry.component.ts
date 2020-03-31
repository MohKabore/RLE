import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetrofitService } from 'src/app/_services/retrofit.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Utils } from 'src/app/shared/utils';
import { MDBDatePickerComponent, ClockPickerComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-retrofit-stock-entry',
  templateUrl: './retrofit-stock-entry.component.html',
  styleUrls: ['./retrofit-stock-entry.component.scss']
})
export class RetrofitStockEntryComponent implements OnInit {
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('datePicker', { static: true }) datePicker: MDBDatePickerComponent;
  @ViewChild('timePicker', { static: true }) timePicker: ClockPickerComponent;
  stockForm: FormGroup;
  stores: any = [];
  total = 0;
  products: any = [];
  myDatePickerOptions = Utils.myDatePickerOptions;
  waitForValidation = true;
  currentUserId;
  selectProducts: any = [];


  constructor(private authService: AuthService, private fb: FormBuilder, private retroService: RetrofitService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.getStores();
    this.getProducts();
    this.createStockForm();

  }

  createStockForm() {
    this.stockForm = this.fb.group({
      refNum: [''],
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
      toStoreId: [null, Validators.required]
    });

  }

  getStores() {
    this.retroService.getStores().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { label: res[i].name, value: res[i].id };
        this.stores = [...this.stores, element];
      }
    });
  }
  getProducts() {
    this.products = [];
    this.retroService.getProducts().subscribe((res: any[]) => {
      this.products = res;
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


  save() {
    const formData = this.stockForm.value;
    //formData.mvtDate = Utils.inputDateDDMMYY(formData.mvtDate, '/');
    const startDateData = this.stockForm.value.startDate.split('/');
    const startTimeDate = this.stockForm.value.startTime.split(':');
    formData.mvtDate = new Date(startDateData[2], startDateData[1] - 1,
      startDateData[0], startTimeDate[0], startTimeDate[1]);
    formData.products = this.products;
    this.retroService.stockEntry(this.currentUserId, formData).subscribe((res) => {
      this.alertify.success('enregistrement terminé...');
      this.stockForm.reset();
      this.total = 0;
      this.getProducts();
    });
  }

  setTotal() {
    this.total = this.products.reduce((sum, item) => sum + (item.qty ? Number(item.qty) : 0), 0);
  }

  checkSelected() {
    this.waitForValidation = true;
    this.selectProducts = [];
    this.selectProducts = this.products.filter(a => a.qty);
    this.waitForValidation = false;
  }

}
