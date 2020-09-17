import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { StockService } from 'src/app/_services/stock.service';

@Component({
  selector: 'app-export-point',
  templateUrl: './export-point.component.html',
  styleUrls: ['./export-point.component.scss']
})
export class ExportPointComponent implements OnInit {

  regionsDetails: any[];
  totalTablets: number;
  totalCat1: number;
  totalCat2: number;
  latestDate: any;
  searchForm: FormGroup;
  myDatePickerOptions = Utils.myDatePickerOptions;
  noResult = '';
  showSearch = true;
  constructor(private fb: FormBuilder, private stockService: StockService) { }

  ngOnInit() {
    this.getRegionsData();
    this.createSearchForm();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  getRegionsData() {
    this.stockService.getEnrolmentSdCardData().subscribe((res: any) => {
      this.totalCat1 = res.totalCat1;
      this.totalTablets = res.totalTablet;
      this.totalCat2 = res.totalCat2;
      this.latestDate = res.latestDate;
      this.regionsDetails = res.regionregionToReturn;
    });
  }
  search() {
    this.regionsDetails = [];
    this.noResult = '';
    this.showSearch = false;
    const formData = this.searchForm.value;

    if (formData.startDate) {
      formData.startDate = Utils.inputDateDDMMYY(formData.startDate, '/');
    }
    if (formData.endDate) {
      formData.endDate = Utils.inputDateDDMMYY(formData.endDate, '/');
    }
    this.stockService.getEnrolmentDataByInterval(formData).subscribe((res: any) => {
      console.table(res);
      this.showSearch = true;
      if (res != null) {
        this.totalCat1 = res.totalCat1;
        this.totalTablets = res.totalTablet;
        this.totalCat2 = res.totalCat2;
        this.latestDate = res.latestDate;
        this.regionsDetails = res.regionregionToReturn;
      } else {
        this.noResult = 'aucune donnée trouvée...';
      }
    });
  }

}
