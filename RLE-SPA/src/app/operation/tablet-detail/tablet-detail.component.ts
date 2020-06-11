import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-tablet-detail',
  templateUrl: './tablet-detail.component.html',
  styleUrls: ['./tablet-detail.component.scss'],
  animations: [SharedAnimations]
})
export class TabletDetailComponent implements OnInit {
  searchForm: FormGroup;
  tablet: any;
  inventOps: any[];
  noResult = '';
  showSearchDiv = false;

  constructor(private fb: FormBuilder, private stockService: StockService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.createSearchForm();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      imei: ['', Validators.required]
    });
  }

  verifyImei() {

    const imei = this.searchForm.value.imei;
    this.noResult = '';
    this.tablet = null;
    if (imei.length === 5) {

      this.stockService.getTabletByImei(imei).subscribe((tablet: any) => {
        if (tablet === null) {
          this.noResult = 'imei non trouvé...';
          this.alertify.error(this.noResult);
        } else {
          this.tablet = tablet;
          this.alertify.success('imei correcte');

        }
      }, error => {
        console.log(error);
      });
    }

  }

  searchTabletDetails() {
    this.showSearchDiv = false;
    this.inventOps = [];
    this.stockService.searchTabletDetails(this.tablet.id).subscribe((res: any[]) => {
      this.inventOps = res;
      this.showSearchDiv = true;
    }, error => {
      console.log(error);
    });
  }

}
