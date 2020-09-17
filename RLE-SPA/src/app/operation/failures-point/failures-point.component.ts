import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/_services/stock.service';
import { Utils } from 'src/app/shared/utils';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ExcelService } from 'src/app/_services/excel.service';


@Component({
  selector: 'app-failures-point',
  templateUrl: './failures-point.component.html',
  styleUrls: ['./failures-point.component.scss'],
  animations: [SharedAnimations]
})
export class FailuresPointComponent implements OnInit {
  searchForm: FormGroup;
  myDatePickerOptions = Utils.myDatePickerOptions;
  noResult = '';
  failures: any[];
  showSearch = false;



  constructor(private fb: FormBuilder, private stockService: StockService, private excelService: ExcelService) { }

  ngOnInit() {
    this.createSearchForm();
  }

  searchFailures() {
    this.failures = [];
    this.noResult = '';
    this.showSearch = true;
    const formData = this.searchForm.value;
    if (formData.startDate) {
      formData.startDate = Utils.inputDateDDMMYY(formData.startDate, '/');
    }
    if (formData.endDate) {
      formData.endDate = Utils.inputDateDDMMYY(formData.endDate, '/');
    }
    this.stockService.getFailures(formData).subscribe((res: any[]) => {
      if (res.length > 0) {
        this.failures = res;
      } else {
        this.noResult = 'aucune panne trouvée...';
      }
    });

  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  reset() {
    this.createSearchForm();
    this.showSearch = false;
  }

  exportAsXLSX(): void {
    let failuresToExport: any[] = [];
    for (let index = 0; index < this.failures.length; index++) {
      const element = this.failures[index];
      const fail: any = {};
      if (element.tabletId) {
        fail.tablette_en_panne = element.tablet.imei + '(' + element.tablet.tabletType.name + ')';
      } else {
        fail.tablette_en_panne = 'N/A';
      }

      if (element.tabletExId) {
        fail.tablette_de_rechange = element.tabletEx.imei  + '('+element.tabletEx.tabletType.name+')';;
      } else {
        fail.tablette_de_rechange = 'N/A';
      }

      fail.region = element.region.name;
      if (element.departmentId) {
        fail.department = element.department.name;
        fail.code = element.department.code;
      } else {
        fail.department = '';
        fail.code = '';
      }
      fail.date_de_la_panne = element.failureDateString;
      if (element.maintDate) {
        fail.date_echange = element.maintDateString;
      } else {
        fail.date_echange = 'N/A';
      }
      fail.panne = element.failureList1.name;
      if (element.note1) {
        fail.panne = fail.panne = '(' + element.note1 + ')';
      }

      failuresToExport = [...failuresToExport, fail];
    }
    this.excelService.exportAsExcelFile(failuresToExport, 'point échanges');
  }

}
