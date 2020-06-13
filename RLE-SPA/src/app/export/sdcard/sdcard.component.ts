import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-sdcard',
  templateUrl: './sdcard.component.html',
  styleUrls: ['./sdcard.component.scss']
})
export class SdcardComponent implements OnInit {
  regions: any[] = [];
  maints: any[] = [];
  wait = false;
  myDatePickerOptions = Utils.myDatePickerOptions;
  sdNum = '';
  noResult1 = '';
  noResult2 = '';
  noResult3 = '';
  noResult4 = '';
  noResult5 = '';
  currentUserId: number;
  sdcard1: any;
  sdcard2: any;
  sdcard3: any;
  sdcard4: any;
  sdcard5: any;

  sdcardForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private userService: UserService, private stockService: StockService,
    private alertify: AlertifyService, private router: Router) { }


  ngOnInit() {
    this.inittablets();
    this.currentUserId = this.authService.currentUser.id;
    this.getRegions();
    this.createSdCardForm();

  }

  getRegions() {
    this.authService.getRegions().subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }

  getSelectedMaints() {
    const departmentId = this.sdcardForm.value.regionId;
    this.maints = [];
    this.userService.getSelectedMaintsByRegionId(departmentId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].lastName + ' ' + res[i].firstName };
        this.maints = [...this.maints, element];
      }
    }, error => {
      console.log(error);
    });
  }

  createSdCardForm() {
    this.sdcardForm = this.fb.group({
      regionId: [null, Validators.required],
      employeeId: [null, Validators.required],
      fullExport: [false]
    });
  }
  save() {
    this.wait = true;
    const sdData = this.sdcardForm.value;
    let sdcardTablets: any[] = [];
    if (this.sdcard1.exportDate) {
      this.sdcard1.exportDate = Utils.inputDateDDMMYY(this.sdcard1.exportDate, '/');
      sdcardTablets = [...sdcardTablets, this.sdcard1];
    }

    if (this.sdcard2.exportDate) {
      this.sdcard2.exportDate = Utils.inputDateDDMMYY(this.sdcard2.exportDate, '/');
      sdcardTablets = [...sdcardTablets, this.sdcard2];
    }

    if (this.sdcard3.exportDate) {
      this.sdcard3.exportDate = Utils.inputDateDDMMYY(this.sdcard3.exportDate, '/');
      sdcardTablets = [...sdcardTablets, this.sdcard2];
    }

    if (this.sdcard4.exportDate) {
      this.sdcard4.exportDate = Utils.inputDateDDMMYY(this.sdcard4.exportDate, '/');
      sdcardTablets = [...sdcardTablets, this.sdcard4];
    }

    if (this.sdcard5.exportDate) {
      this.sdcard5.exportDate = Utils.inputDateDDMMYY(this.sdcard5.exportDate, '/');
      sdcardTablets = [...sdcardTablets, this.sdcard5];
    }
    sdData.sdcardTablets = sdcardTablets;
    sdData.sdnum = this.sdNum;
    // console.log(sdData);
    this.stockService.saveSdCard(this.currentUserId, sdData).subscribe((res) => {
      this.sdcardForm.reset();
      this.inittablets();
      this.sdNum = '';
      this.alertify.success('enregistrement terminé...');
      this.wait = false;
    }, error => {
      this.router.navigate(['/error']);
    });

  }
  generateSdnum() {
    this.sdNum = '';
    const f = this.sdcard1.exportDate;
    this.sdNum = this.sdcard1.imei + '-' + f.charAt(0) + f.charAt(1) + f.charAt(3) + f.charAt(4);
    console.log(this.sdNum);
  }

  getImei1(imei1) {

    this.noResult1 = '';
    this.sdcard1.tabletId = null;
    if (imei1.length === 5) {

      this.stockService.getTabletByImei(imei1).subscribe((tablet: any) => {
        if (tablet === null) {
          this.noResult1 = 'imei non trouvé...';
        } else {
          this.sdcard1.tabletId = tablet.id;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  getImei2(imei2) {

    this.noResult2 = '';
    this.sdcard2.tabletId = null;
    if (imei2.length === 5) {

      this.stockService.getTabletByImei(imei2).subscribe((tablet: any) => {
        if (tablet === 0) {
          this.noResult2 = 'imei non trouvé...';
        } else {
          this.sdcard2.tabletId = tablet.id;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  getImei3(imei3) {

    this.noResult3 = '';
    this.sdcard3.tabletId = null;
    if (imei3.length === 5) {

      this.stockService.getTabletByImei(imei3).subscribe((tablet: any) => {
        if (tablet === 0) {
          this.noResult3 = 'imei non trouvé...';
        } else {
          this.sdcard3.tabletId = tablet.id;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  getImei4(imei4) {

    this.noResult4 = '';
    this.sdcard1.tabletId = null;
    if (imei4.length === 5) {

      this.stockService.getTabletByImei(imei4).subscribe((tablet: any) => {
        if (tablet === 0) {
          this.noResult4 = 'imei non trouvé...';
        } else {
          this.sdcard4.tabletId = tablet.id;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  getImei5(imei5) {

    this.noResult5 = '';
    this.sdcard1.tabletId = null;
    if (imei5.length === 5) {

      this.stockService.getTabletByImei(imei5).subscribe((tablet: any) => {
        if (tablet === 0) {
          this.noResult5 = 'imei non trouvé...';
        } else {
          this.sdcard5.tabletId = tablet.id;
        }
      }, error => {
        console.log(error);
      });
    }
  }


  inittablets() {
    this.sdcard1 = {
      exportDate: null,
      imei: '',
      cat1: null,
      cat2: null,
      tabletId: null,
      numExport: null,
      nistCat1: null,
      nistCat2: null
    };

    this.sdcard2 = {
      exportDate: null,
      imei: '',
      cat1: null,
      cat2: null,
      tabletId: null,
      numExport: null,
      nistCat1: null,
      nistCat2: null
    };
    this.sdcard3 = {
      exportDate: null,
      imei: '',
      cat1: null,
      cat2: null,
      tabletId: null,
      numExport: null,
      nistCat1: null,
      nistCat2: null
    };
    this.sdcard4 = {
      exportDate: null,
      imei: '',
      cat1: null,
      cat2: null,
      tabletId: null,
      numExport: null,
      nistCat1: null,
      nistCat2: null
    };
    this.sdcard5 = {
      exportDate: null,
      imei: '',
      cat1: null,
      cat2: null,
      tabletId: null,
      numExport: null,
      nistCat1: null,
      nistCat2: null
    };
  }

}
