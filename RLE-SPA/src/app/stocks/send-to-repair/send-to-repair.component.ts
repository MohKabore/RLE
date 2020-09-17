import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { Router } from '@angular/router';
import { StockService } from 'src/app/_services/stock.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-send-to-repair',
  templateUrl: './send-to-repair.component.html',
  styleUrls: ['./send-to-repair.component.scss']
})
export class SendToRepairComponent implements OnInit {

  myDatePickerOptions = Utils.myDatePickerOptions;
  stockForm: FormGroup;
  tablets: any = [];
  currentUserId;
  showTablets = false;
  wait = false;
  departments: any = [];

  stores = environment.mainStores;

  constructor(private fb: FormBuilder, private router: Router, private stockService: StockService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.createStockForm();
    this.currentUserId = this.authService.currentUser.id;
  }

  createStockForm() {
    this.stockForm = this.fb.group({
      refNum: [''],
      mvtDate: [null, Validators.required],
      fromStoreId: [null, Validators.required],
      toStoreId: [null, Validators.required],
      tabletIds: [null, Validators.required]
    });
  }

  saveSendTorepair() {

  }

//   getBrokenTablets() {
// const storeId = this.stockForm.value.fromStoreId;
// this.stockService.getStoreBrokenTablets(storeId).subscribe((res : any[]));

//   }

}
