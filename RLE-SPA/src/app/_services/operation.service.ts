import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  baseUrl = environment.apiUrl + 'operation/';


  constructor(private http: HttpClient) { }

  affectOp(currentUserId: number, assignmentModeol) {
    return this.http.post(this.baseUrl + 'AssignOp/' + currentUserId, assignmentModeol);
  }

  verifyImeis(imeis) {
    return this.http.post(this.baseUrl + 'VerifyImeis', imeis);
  }

  verifyEcCodes(ecCodes) {
    return this.http.post(this.baseUrl + 'VerifyEcCodes', ecCodes);
  }

  affectNewUsers(insertUserid, newEmps) {
    return this.http.post(this.baseUrl + 'AffectNewUsers/' + insertUserid, newEmps);
  }

}
