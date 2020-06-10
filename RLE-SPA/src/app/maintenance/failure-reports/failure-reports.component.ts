import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/_services/stock.service';

@Component({
  selector: 'app-failure-reports',
  templateUrl: './failure-reports.component.html',
  styleUrls: ['./failure-reports.component.scss']
})
export class FailureReportsComponent implements OnInit {

  failures: any[] = [];
  constructor(private stockService: StockService) { }

  ngOnInit() {
    this.getFailures();
  }
  getFailures() {
    this.stockService.getDeclaredFailures().subscribe((res :  any[]) => {
      this.failures = res;
    });
  }



}
