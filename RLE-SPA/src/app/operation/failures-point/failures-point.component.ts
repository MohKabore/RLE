import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/_services/stock.service';
import { Utils } from 'src/app/shared/utils';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

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


  constructor(private fb: FormBuilder, private stockService: StockService) { }

  ngOnInit() {
    this.createSearchForm();
  }

  searchFailures() {
    this.failures = [];
    this.noResult = '';
    this.showSearch = true;
    const formData = this.searchForm.value;
    if(formData.startDate) {
      formData.startDate = Utils.inputDateDDMMYY(formData.startDate, '/');
    }
    if(formData.endDate) {
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

}
