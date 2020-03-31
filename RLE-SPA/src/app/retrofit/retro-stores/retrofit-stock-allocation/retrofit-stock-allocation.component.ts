import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetrofitService } from 'src/app/_services/retrofit.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Utils } from 'src/app/shared/utils';
import { MDBDatePickerComponent, ClockPickerComponent } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retrofit-stock-allocation',
  templateUrl: './retrofit-stock-allocation.component.html',
  styleUrls: ['./retrofit-stock-allocation.component.scss']
})
export class RetrofitStockAllocationComponent implements OnInit {
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('datePicker', { static: true }) datePicker: MDBDatePickerComponent;
  @ViewChild('timePicker', { static: true }) timePicker: ClockPickerComponent;
  stockForm: FormGroup;
  stores: any = [];
  total = 0;
  products: any = [];
  selectProducts: any = [];
  myDatePickerOptions = Utils.myDatePickerOptions;
  showProducts = false;
  waitForValidation = true;
  isValid = false;
  currentUserId;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private retroService: RetrofitService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.getStores();
    this.createStockForm();

  }

  createStockForm() {
    this.stockForm = this.fb.group({
      refNum: [''],
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
      fromStoreId: [null, Validators.required],
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
    const storeId = this.stockForm.value.fromStoreId;
    if (storeId) {
      this.showProducts = false;
      this.products = [];
      this.retroService.getStoreProducts(storeId).subscribe((res: any[]) => {
        this.products = res;
        this.showProducts = true;
      }, error => {
        this.router.navigate(['/error']);
      });
    }
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
    formData.products = this.selectProducts;
    this.retroService.stockTansfter(this.currentUserId, formData).subscribe((res) => {
      this.alertify.success('enregistrement terminé...');
      this.stockForm.reset();
      this.selectProducts = [];
      this.isValid = false;
      this.products = [];
    }, error => {
      this.router.navigate(['/error']);
    });
  }

  setTotal() {
    this.total = this.products.reduce((sum, item) => sum + (item.qty ? Number(item.newQty) : 0), 0);
  }
  checkQty(currentQty, insertQty, index) {
    if (currentQty < insertQty) {
      this.alertify.warning('veuillez saisir une quantité inférieur à ' + currentQty);
      this.products[index].newQty = 0;
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  checkSelected() {
    this.waitForValidation = true;
    this.selectProducts = [];
    this.selectProducts = this.products.filter(a => a.newQty);
    this.waitForValidation = false;

  }
}
