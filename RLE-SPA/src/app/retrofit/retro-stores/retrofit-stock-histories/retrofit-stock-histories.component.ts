import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RetrofitService } from 'src/app/_services/retrofit.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Utils } from 'src/app/shared/utils';
import { RetrofitInventOp } from 'src/app/_models/retrofit-invent-op';

@Component({
  selector: 'app-retrofit-stock-histories',
  templateUrl: './retrofit-stock-histories.component.html',
  styleUrls: ['./retrofit-stock-histories.component.scss']
})
export class RetrofitStockHistoriesComponent implements OnInit {
  tab1SearchForm: FormGroup;
  tab2SearchForm: FormGroup;
  tab1Inventops: RetrofitInventOp[] = [];
  tab2Inventops: RetrofitInventOp[] = [];
  tab1NoResult = '';
  tab2NoResult = '';
  showtab1Result = false;
  showtab2Result = false;

  tab1Stores: any = [];
  tab2Stores: any = [];
  myDatePickerOptions = Utils.myDatePickerOptions;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private retroService: RetrofitService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.getStores();
    this.createTab1SearchForm();
    this.createTab2SearchForm();
  }

  getStores() {
    this.retroService.getStores().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { label: res[i].name, value: res[i].id };
        this.tab1Stores = [...this.tab1Stores, element];
        this.tab2Stores = [...this.tab2Stores, element];
      }
    });
  }

  createTab1SearchForm() {
    this.tab1SearchForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      storeId: [null, Validators.required]
    });

  }

  createTab2SearchForm() {
    this.tab2SearchForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      storeIds: [null, Validators.required]
    });

  }

  tab1Search() {
    this.showtab1Result = true;
    this.tab1Inventops = [];
    this.tab1NoResult = '';
    const formData = this.tab1SearchForm.value;
    if (formData.startDate) {
      formData.startDate = Utils.inputDateDDMMYY(formData.startDate, '/');
    }
    if (formData.endDate) {
      formData.endDate = Utils.inputDateDDMMYY(formData.endDate, '/');
    }
    this.retroService.getSingleStoreHistories(formData).subscribe((res: RetrofitInventOp[]) => {
      if (res.length > 0) {
        this.tab1Inventops = res;
      } else {
        this.tab1NoResult = 'Aucun mouvement trouvé...';
      }
    }, error => {
      this.router.navigate(['error']);
    });
  }

  tab2Search() {
    this.showtab2Result = true;
    this.tab2Inventops = [];
    this.tab2NoResult = '';
    const formData = this.tab2SearchForm.value;
    if (formData.startDate) {
      formData.startDate = Utils.inputDateDDMMYY(formData.startDate, '/');
    }
    if (formData.endDate) {
      formData.endDate = Utils.inputDateDDMMYY(formData.endDate, '/');
    }
    this.retroService.getMultiStoreHistories(formData).subscribe((res: RetrofitInventOp[]) => {
      if (res.length > 0) {
        this.tab2Inventops = res;
      } else {
        this.tab2NoResult = 'Aucun mouvement trouvé...';
      }
    }, error => {
      this.router.navigate(['error']);
    });
  }



}
