import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { StockService } from 'src/app/_services/stock.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { Utils } from 'src/app/shared/utils';
import { Region } from 'src/app/_models/region';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  wait = false;
  searchForm: FormGroup;
  exportForm: FormGroup;
  maints: any[] = [];
  sdcards: any[] = [];
  employees: User[] = [];
  regions: any[] = [];
  reg: Region[] = [];
  renum = '';
  export: any;
  myDatePickerOptions = Utils.myDatePickerOptions;
  showSearchDiv = false;
  noResult;





  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService,
    private stockService: StockService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.createExportForm();
    this.createSearchForm();
    this.getRegions();

  }

  createExportForm() {
    this.exportForm = this.fb.group({
      regionId: [null, Validators.required],
      employeeId: [null, Validators.required],
      exportDate: [null, Validators.required],
      sdcardIds: [null, Validators.required]
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      renum: ['', Validators.required]
    });
  }

  getRegions() {
    this.authService.getRegions().subscribe((res: any[]) => {
      this.reg = res;
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].name };
        this.regions = [...this.regions, element];
      }
    });
  }

  getSelectedMaints() {
    const regionId = this.exportForm.value.regionId;
    this.maints = [];
    this.employees = [];
    if (regionId) {
      this.userService.getSelectedMaintsByRegionId(regionId).subscribe((res: any[]) => {
        this.employees = res;
        for (let i = 0; i < res.length; i++) {
          const element = { value: res[i].id, label: res[i].lastName + ' ' + res[i].firstName };
          this.maints = [...this.maints, element];
        }
      }, error => {
        console.log(error);
      });
    }
  }
  getSdcards() {
    const regionId = this.exportForm.value.regionId;
    this.sdcards = [];
    this.stockService.getSdCardForExport(regionId).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const element = { value: res[i].id, label: res[i].sdnum };
        this.sdcards = [...this.sdcards, element];
      }
    });
  }

  generateRenum() {
    this.renum = '';
    const f = this.exportForm.value.exportDate;
    const employeeId = this.exportForm.value.employeeId;
    const regionId = this.exportForm.value.regionId;
    const regCode = this.reg.find(a => a.id === regionId).code;
    const mat = this.employees.find(a => a.id === employeeId).idnum;
    this.renum = Number(regCode) + '-' + mat + '-' + f.charAt(0) + f.charAt(1) + f.charAt(3) + f.charAt(4);
    console.log(this.renum);
  }

  save() {
    const formData = this.exportForm.value;
    formData.renum = this.renum;
    formData.exportDate = Utils.inputDateDDMMYY(formData.exportDate, '/');
    this.stockService.createExport(formData).subscribe(() => {
      this.alertify.success('enregistrement terminé...');
      this.exportForm.reset();
      this.maints = [];
      this.sdcards = [];
      this.renum = '';
      this.exportForm.controls['exportDate'].setValue(null);

    }, error => {
      this.router.navigate(['/error']);
    });
  }

  searchExport() {
    this.export = null;
    const renum = this.searchForm.value.renum;
    this.noResult = '';
    this.showSearchDiv = true;
    this.stockService.searchExportByRenum(renum).subscribe((res: any) => {
      if (res !== null) {
        this.export = res;
      } else {
        this.noResult = 'enveloppe introuvable...';
      }
    });
  }

  deleteExport() {
    this.stockService.deleteExport(this.export.id).subscribe(()=> {
      this.alertify.success('suppression terminée...');
      this.showSearchDiv = false;
      this.noResult='';
      this.searchForm.reset();
    }, error => {
      this.router.navigate(['/error']);
    });
  }

}
