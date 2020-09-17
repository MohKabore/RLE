import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AuthService } from 'src/app/_services/auth.service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

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
  tablets: any[];
  allTablets: any[];
  noResult = '';
  showSearchDiv = false;
  ecdataId: number;
  currentUserId: number;
  tabletId: number;


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

  selectTablet(tabletId) {
    this.tablet = this.allTablets.find(a => a.id === tabletId);
  }

  verifyImei() {

    const imei = this.searchForm.value.imei;
    this.noResult = '';
    this.tablets = [];
    this.allTablets = [];
    this.tablet = null;
    this.showSearchDiv = false;
    if (imei.length === 5) {

      this.stockService.getTabletByImei(imei).subscribe((res: any) => {
        if (res.length === 0) {
          this.noResult = 'imei non trouvé...';
          this.alertify.error(this.noResult);
        } else {
          if (res.length === 1) {
            this.tablet = res[0];
            this.alertify.success('imei correcte');
          } else {
            this.allTablets = res;
            this.alertify.success('plusieurs tablettes trouvées');
            for (let index = 0; index < res.length; index++) {
              const element = { value: res[index].id, label: res[index].imei + '(' + res[index].tabletType.name + ')' };
              this.tablets = [...this.tablets, element];
            }
          }


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
