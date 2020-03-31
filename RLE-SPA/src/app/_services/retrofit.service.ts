import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RetrofitService {
  baseUrl = environment.apiUrl + 'Retrofit/';
  constructor(private http: HttpClient) { }
  addNewStore(store) {
    return this.http.post(this.baseUrl + 'AddStore', store);
  }
  stockEntry(userId, stockEntryModel) {
    return this.http.post(this.baseUrl + 'StockEntry/' + userId, stockEntryModel);
  }

  stockTansfter(userId, stockAllocationModel) {
    return this.http.post(this.baseUrl + 'StockTransfert/' + userId, stockAllocationModel);
  }
  updateStore(stroreId, store) {
    return this.http.put(this.baseUrl + 'UpdateStore/' + stroreId, store);
  }


  getStoresDetailList() {
    return this.http.get(this.baseUrl + 'StoresList');
  }

  getStores() {
    return this.http.get(this.baseUrl + 'Stores');
  }

  getProducts() {
    return this.http.get(this.baseUrl + 'Products');
  }
  getStoreProducts(storeId: number) {
    return this.http.get(this.baseUrl + 'StoreProducts/' + storeId);
  }
  getSingleStoreHistories(searchModel) {
    return this.http.post(this.baseUrl + 'SingleStoreHistories', searchModel);
  }

  getMultiStoreHistories(searchModel) {
    return this.http.post(this.baseUrl + 'MultiStoreHistories', searchModel);
  }

  getProductsDetails() {
    return this.http.get(this.baseUrl + 'ProductsDetails');
  }

  addNewProduct(productName) {
    return this.http.post(this.baseUrl + 'AddProduct/' + productName, {});
  }

  updateProduct(productId, productName) {
    return this.http.post(this.baseUrl + 'UpdateProduct/' + productId + '/' + productName, {});
  }
}
