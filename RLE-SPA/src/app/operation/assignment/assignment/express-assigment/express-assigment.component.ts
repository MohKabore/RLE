import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { OperationService } from 'src/app/_services/operation.service';
import { Utils } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-express-assigment',
  templateUrl: './express-assigment.component.html',
  styleUrls: ['./express-assigment.component.scss']
})
export class ExpressAssigmentComponent implements OnInit {

  file: File = null;
  importedUsers: any = [];
  imeis: any = [];
  ecCodes: any = [];
  showExport = false;
  canAddUsers = true;
  birthDateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  wait = false;
  isOk = false;
  currentuserId: number;
  typeOperatorid = environment.operatortypeId;
  headElements = ['#', 'nom', 'Prenoms', 'Contact(s)', 'Tablette', 'Code centre', 'Date affectation'];
  // myDatePickerOptions = Utils.myDatePickerOptions;



  constructor(private authService: AuthService,private router: Router, private alertify: AlertifyService, private operationService: OperationService) { }


  ngOnInit() {
    this.currentuserId = this.authService.currentUser.id;
  }
  onFileChange(ev) {
    this.wait = true;
    this.canAddUsers = true;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      let idx = 0;
      this.importedUsers = [];
      this.ecCodes = [];
      this.imeis = [];
      const d = jsonData;
      // debugger;
      for (let i = 0; i < d.at.length; i++) {
        const la_ligne = d.at[i];
        const element: any = {};
        element.lastName = la_ligne.nom;
        element.firstName = la_ligne.prenoms,
          element.phoneNumber = la_ligne.contact1,
          element.secondPhoneNumber = la_ligne.contact2,
          element.email = la_ligne.email;
        this.imeis = [...this.imeis, la_ligne.tablette];
        element.imei = la_ligne.tablette;
        element.ecCode = la_ligne.code_centre;
        element.indx = idx;

        this.ecCodes = [...this.ecCodes, { ecCode: la_ligne.code_centre, indx: idx }];
        this.importedUsers = [...this.importedUsers, element];
        idx = idx + 1;
      }
      this.verifyInformations();
      this.showExport = true;
      this.wait = false;
      // if (this.authService.isMaintenancier()) {
      //   this.getDepartments();
      // } else {
      //   this.getRegions();
      // }
      // this.createSearchForms();

      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  verifyInformations() {
    this.operationService.verifyEcCodes(this.ecCodes).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const elt = res[i];
        const currentEcCode = this.importedUsers.find(a => a.indx === elt.indx);
        currentEcCode.ecExist = elt.exist;
        if (elt.exist) {
          currentEcCode.enrolmentCenterId = elt.id;
          currentEcCode.enrolmentCenterName = elt.name;
          currentEcCode.municipalityId = elt.municipalityId;
          currentEcCode.resCityId = elt.municipality.cityId;
          currentEcCode.departmentId = elt.municipality.city.departmentId;
          currentEcCode.regionId = elt.municipality.city.department.regionId;
        } else {
          console.log('ce centre n\'a pas été trouvé');
          this.canAddUsers = false;
        }
      }
    });


    this.operationService.verifyImeis(this.imeis).subscribe((res: any[]) => {
      for (let i = 0; i < res.length; i++) {
        const elt = res[i];
        const currentImei = this.importedUsers.find(a => a.imei.toString() === elt.imei);
        currentImei.tabletExist = elt.exist;
        if (elt.exist) {
          currentImei.tabletId = elt.id;
          currentImei.store = elt.store;
          currentImei.storeId = elt.storeId;
        } else {
          console.log('cette tablette  n\'a pas été trouvée...');
          this.canAddUsers = false;
        }
      }
    });
  }


  save() {
    for (let i = 0; i < this.importedUsers.length; i++) {
      const element = this.importedUsers[i];
      element.opDate = Utils.inputDateDDMMYY(element.opDate, '/');
      element.typeEmpId = this.typeOperatorid;
    }
    this.wait = true;

    this.operationService.affectNewUsers(this.currentuserId, this.importedUsers).subscribe(() => {
      this.showExport = false;
      this.importedUsers = [];
      this.alertify.success('enregistrement terminée...');
      this.wait = false;
    }, error => {
      this.router.navigate(['/error']);
    });
  }


  verifyOpDates() {
    this.isOk = false;
    let total = 0;
    for (let i = 0; i < this.importedUsers.length; i++) {
      const element = this.importedUsers[i];
      if (element.opDate) {
        total = total + 1;
      }
    }
    if (total === this.importedUsers.length) {
      this.isOk = true;

    }
  }


}
