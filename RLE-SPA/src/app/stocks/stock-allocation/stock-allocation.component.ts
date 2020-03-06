import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { StockService } from 'src/app/_services/stock.service';
import { AuthService } from 'src/app/_services/auth.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stock-allocation',
  templateUrl: './stock-allocation.component.html',
  styleUrls: ['./stock-allocation.component.scss']
})
export class StockAllocationComponent implements OnInit {

  myDatePickerOptions = Utils.myDatePickerOptions;
  stockForm: FormGroup;
  tablets: any = [];
  currentUserId;
  showTablets = false;
  wait = false;
  regions: any = [];
  departments: any = [];

  stores = environment.mainStores;
  cieStoreId = environment.ceiStoreId;
  showRegion = false;

  constructor(private fb: FormBuilder, private router: Router, private stockService: StockService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createStockForm();
    this.currentUserId = this.authService.currentUser.id;
    this.getRegions();
  }

  createStockForm() {
    this.stockForm = this.fb.group({
      refNum: [''],
      mvtDate: [null, Validators.required],
      fromStoreId: [null, Validators.required],
      toStoreId: [null, Validators.required],
      regionId: [null],
      departmentId: [null]

    });
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.tablets = [];
      const d = jsonData;
      // debugger;
      for (let i = 0; i < d.tablettes.length; i++) {
        const la_ligne = d.tablettes[i];
        this.tablets = [...this.tablets, la_ligne.imei];
      }
      console.log(this.tablets);
      this.showTablets = true;

    };
    reader.readAsBinaryString(file);
  }

  saveStockAllocation() {
    this.wait = true;
    const formData = this.stockForm.value;
    formData.mvtDate = Utils.inputDateDDMMYY(formData.mvtDate, '/');
    formData.imeis = this.tablets;
    this.stockService.createStockAllocation(this.currentUserId, formData).subscribe((res) => {
      this.alertify.success('enregistrement terminé...');
      this.stockForm.reset();
      this.showTablets = false;
      this.tablets = [];
      this.showRegion = false;
      this.departments = [];
      this.wait = false;
    }, error => {
      this.router.navigate(['error']);
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

  cheickStoreTypeId() {
    if (this.stockForm.value.toStoreId === this.cieStoreId) {
      this.showRegion = true;
    } else {
      this.showRegion = false;
    }
  }

  getDepartments() {
    this.departments = [];
    const regionId = this.stockForm.value.regionId;
    this.authService.getInscDeptsByRegionid(regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.departments = [...this.departments, element];
      }
    });
  }

  

}
