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
  return this.http.post(this.baseUrl + 'AddStore' , store);
}
}
