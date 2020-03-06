import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService } from 'src/app/_services/stock.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Utils } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-tablets-allocation',
  templateUrl: './tablets-allocation.component.html',
  styleUrls: ['./tablets-allocation.component.scss']
})
export class TabletsAllocationComponent implements OnInit {
  myDatePickerOptions = Utils.myDatePickerOptions;
  stockForm: FormGroup;
  searchControl: FormControl = new FormControl();

  tablets: any = [];
  // filteredTablets: any = [];
  currentUserId;
  showTablets = false;
  wait = false;
  stores = environment.mainStores;
  noResult = '';


  constructor(private fb: FormBuilder, private router: Router, private stockService: StockService, private authService: AuthService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.createStockForm();
    this.currentUserId = this.authService.currentUser.id;
    // this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(value => {
    //   this.filerData(value);
    // });
  }

  // filerData(val) {
  //   if (val) {
  //     val = val.toLowerCase();
  //   } else {
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


  createStockForm() {
    this.stockForm = this.fb.group({
      refNum: [''],
      mvtDate: [null, Validators.required],
      toStoreId: [null, Validators.required],
      fromStoreId: [null, Validators.required]
    });
  }

  getSourceTablets() {
    this.showTablets = true;
    this.noResult = '';
    const fromStoreId = this.stockForm.value.fromStoreId;
    this.tablets = [];
    this.stockService.getStoreTablets(fromStoreId).subscribe((res: any[]) => {
      if (res.length > 0) {
        this.tablets = res;
        // this.filteredTablets = res;
      } else {
        this.noResult = 'aucune tablette trouvée...';
      }
    }, error => {
      console.log(error);
    });
  }

  saveStockAllocation() {

  }

}
