import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Region } from '../_models/region';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  baseUrl = environment.apiUrl + 'stock/';


  constructor(private http: HttpClient) { }
  getStoreTablets(storeId: number) {
    return this.http.get(this.baseUrl + 'StoreTablets/' + storeId);
  }

  getMaintainerTablets(maintainerid: number) {
    return this.http.get(this.baseUrl + 'MaintainerTablets/' + maintainerid);
  }

  getDeptTablets(departmentId: number) {
    return this.http.get(this.baseUrl + 'DepartmentTablets/' + departmentId);
  }
  getTabletByImei(imei: string) {
    return this.http.get(this.baseUrl + 'GetTabletByImei/' + imei);
  }

  getStoreTabletByImei(storeId: number, imei: string) {
    return this.http.get(this.baseUrl + 'GetStoreTabletByImei/' + storeId + '/' + imei);
  }

  createStockAllocation(currentUserId: number, allocationModel, tabletTypeId) {
    return this.http.post(this.baseUrl + 'StockAllocation/' + tabletTypeId + '/' + currentUserId, allocationModel);
  }

  createTabletAllocation(currentUserId: number, allocationModel) {
    return this.http.post(this.baseUrl + 'TabletAllocation/' + currentUserId, allocationModel);
  }

  saveApproSphare(currentUserId: number, approSphareModel) {
    return this.http.post(this.baseUrl + 'ApproSphare/' + currentUserId, approSphareModel);
  }

  saveBackTablet(currentUserId: number, approSphareModel) {
    return this.http.post(this.baseUrl + 'BackSphare/' + currentUserId, approSphareModel);
  }

  saveFailure(currentUserId: number, failureModel) {
    return this.http.post(this.baseUrl + 'SaveFailure/' + currentUserId, failureModel);
  }

  saveMaintenance(failureId: number, currentUserId: number, maintenanceModel) {
    return this.http.post(this.baseUrl + 'SaveMaintenance/' + failureId + '/' + currentUserId, maintenanceModel);
  }

  getTabletTypes() {
    return this.http.get(this.baseUrl + 'TabletTypes');
  }

  getDeclaredFailures() {
    return this.http.get(this.baseUrl + 'getdeclaredfailures');
  }
  getFailure(failureId: number) {
    return this.http.get(this.baseUrl + 'getFailure/' + failureId);
  }

  saveEcData(currentUserId: number, failureModel) {
    return this.http.post(this.baseUrl + 'SaveEcData/' + currentUserId, failureModel);
  }



}
