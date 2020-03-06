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

  createStockAllocation(currentUserId: number, allocationModel) {
    return this.http.post(this.baseUrl + 'StockAllocation/' + currentUserId, allocationModel);
  }



}
