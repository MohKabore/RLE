import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AuthService } from 'src/app/_services/auth.service';

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
  ecdataId: number;
  currentUserId: number;

  constructor(private fb: FormBuilder, private authService: AuthService, private stockService: StockService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;

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
  removeEcData() {
    this.stockService.removeEcDate(this.ecdataId).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.searchTabletDetails();
    });
  }

  getSelectedId(id: number) {
    this.ecdataId = id;
  }

}
