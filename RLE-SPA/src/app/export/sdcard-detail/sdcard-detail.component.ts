import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { StockService } from 'src/app/_services/stock.service';

@Component({
  selector: 'app-sdcard-detail',
  templateUrl: './sdcard-detail.component.html',
  styleUrls: ['./sdcard-detail.component.scss']
})
export class SdcardDetailComponent implements OnInit {
  wait = false;
  searchForm: FormGroup;
  sdcard: any;
  noResult = '';
  showSearchDiv = false;
  sdcardId: number;
  currentUserId: number;
  constructor(private fb: FormBuilder, private authService: AuthService,
    private stockService: StockService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser.id;
    this.createSearchForm();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      sdnum: ['', Validators.required]
    });
  }

  searchSdCard() {
    this.sdcard = null;
    this.noResult = '';

    const sdnum = this.searchForm.value.sdnum;
    this.showSearchDiv = true;

    this.stockService.getSdCardBySdnum(sdnum).subscribe((res: any) => {
      if (res != null) {
        this.sdcard = res;
      } else {
        this.noResult = 'aucune sdcard';
      }
    });
  }

  deleteSdcard() {
    this.stockService.removeSdCard(this.sdcard.id).subscribe(() => {
      this.alertify.success('suppression terminée...');
      this.showSearchDiv = false;
      this.searchForm.reset();
      this.noResult = '';
      this.sdcard = null;
    });
  }

}
