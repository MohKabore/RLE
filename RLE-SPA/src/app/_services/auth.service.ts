import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
// import { Period } from '../_models/period';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertifyService } from './alertify.service';
import { TypeEmp } from '../_models/type-emp';
import { Region } from '../_models/region';
import { Department } from '../_models/department';
import { City } from '../_models/city';
import { EducationalTrack } from '../_models/educational-track';
import { StudyLevel } from '../_models/study-level';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';

  adminTypeId = environment.adminTypeId;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  maintTypeId = environment.maintenancierTypeId;
  hotlinerTypeId = environment.hotlinetypeId;


  // newUser = <User>{ id: 0 };
  // currentPeriod: Period;

  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  // child = new BehaviorSubject<User>(this.newUser);
  // currentChild = this.child.asObservable();

  constructor(private http: HttpClient, private alertify: AlertifyService, private router: Router) { }

  changeUserPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  // changeCurrentChild(child: User) {
  //   this.child.next(child);
  // }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            localStorage.setItem('currentPeriod', JSON.stringify(user.currentPeriod));
            // localStorage.setItem('currentChild', JSON.stringify(this.newUser));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            // this.currentPeriod = user.currentPeriod;
            // this.changeCurrentChild(this.newUser);
            this.changeUserPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentPeriod');
    localStorage.removeItem('currentChild');
    this.decodedToken = null;
    this.currentUser = null;
    // this.currentPeriod = null;
    // this.changeCurrentChild(this.newUser);
    this.alertify.info('vous êtes déconnecté');
    this.router.navigate(['/signin']);
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  setUserPassword(id: number, password: string) {
    return this.http.post(this.baseUrl + id + '/setPassword/' + password, {})
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeUserPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }



  setUserLoginPassword(id: number, loginModel: any) {
    return this.http.post(this.baseUrl + id + '/setLoginPassword', loginModel)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeUserPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  forgotPassord(email: string) {
    return this.http.get(this.baseUrl + email + '/ForgotPassword');
  }

  codeValidation(model: any) {
    return this.http.post(this.baseUrl + 'codeValidation', model);
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  isMaintenancier() {
    if (this.loggedIn()) {
      if (this.currentUser.typeEmpId === this.maintTypeId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


  isHotliner() {
    if (this.loggedIn()) {
      if (this.currentUser.typeEmpId === this.hotlinerTypeId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

  confirmEmail(token: string) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.decodedToken = null;
    this.currentUser = null;
    return this.http.get(this.baseUrl + 'emailValidation/' + token);

  }

  resetPassword(token: string) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.decodedToken = null;
    this.currentUser = null;
    return this.http.get(this.baseUrl + 'ResetPassword/' + token);

  }

  finaliseRegistration(model: User) {
    return this.http.post(this.baseUrl + 'LastValidation', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeUserPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  getEmails() {
    return this.http.get(this.baseUrl + 'GetEmails');
  }
  getUserNames() {
    return this.http.get(this.baseUrl + 'GetUserNames');
  }

  getAllCities() {
    return this.http.get(this.baseUrl + 'GetAllCities');
  }

  getLevels() {
    return this.http.get(this.baseUrl + 'GetLevels');
  }

  getDistrictsByCityId(id: number) {
    return this.http.get(this.baseUrl + 'GetDistrictsByCityId/' + id);
  }

  // le post pour enrgister la preinscription : model {father:any,mother:any; children : any[]}
  parentSelfInscription(userId: number, data: any) {
    return this.http.post(this.baseUrl + userId + '/ParentSelfPreinscription', data);
    // .pipe(
    //   map((response: any) => {
    //     const user = response;
    //     if (user) {
    //       localStorage.setItem('token', user.token);
    //       localStorage.setItem('user', JSON.stringify(user.user));
    //       localStorage.setItem('currentPeriod', JSON.stringify(user.currentPeriod));
    //       this.decodedToken = this.jwtHelper.decodeToken(user.token);
    //       this.currentUser = user.user;
    //       this.currentPeriod = user.currentPeriod;
    //       this.changeMemberPhoto(this.currentUser.photoUrl);
    //     }
    //   })
    // );
  }

  teacherSelfPreinscription(userId: number, data: any) {
    return this.http.post(this.baseUrl + userId + '/TeacherSelfPreinscription', data)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            localStorage.setItem('currentPeriod', JSON.stringify(user.currentPeriod));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            // this.currentPeriod = user.currentPeriod;
            this.changeUserPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  emailExist(email: string) {
    return this.http.get(this.baseUrl + email + '/VerifyEmail');
  }

  userNameExist(userName: string) {
    return this.http.get(this.baseUrl + userName + '/VerifyUserName');
  }

  addUserPhoto(userId: number, photo: any) {
    // return this.http.post(environment.apiUrl + 'users/' + userId + '/photos', photo);
    return this.http.post(this.baseUrl + userId + '/AddPhotoForUser', photo);
  }

  getClassLevelProducts(classLevelid: number) {
    return this.http.get(this.baseUrl + 'GetClassLvelProducts/' + classLevelid);
  }

  saveFile(fichier: any) {
    // return this.http.post(environment.apiUrl + 'users/' + userId + '/photos', photo);
    return this.http.post(this.baseUrl + 'AddFile', fichier);
  }

  getAllFiles() {
    return this.http.get(this.baseUrl + 'GetAllFiles');
  }

  getTypeEmps(): Observable<TypeEmp[]> {
    return this.http.get<TypeEmp[]>(this.baseUrl + 'GetTypeEmps');
  }

  getInscTypeEmps(): Observable<TypeEmp[]> {
    return this.http.get<TypeEmp[]>(this.baseUrl + 'GetInscTypeEmps');
  }

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.baseUrl + 'GetRegions');
  }

  getInscRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.baseUrl + 'GetInscRegions');
  }

  getDeptsByRegionid(regionId: number): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl + 'GetDepartments/' + regionId);
  }

  getInscDeptsByRegionid(regionId: number): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl + 'GetInscDepartments/' + regionId);
  }


  getCitiesByDeptid(departmentId): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + 'GetCities/' + departmentId);
  }

  getInscCitiesByDeptid(departmentId): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + 'GetInscCities/' + departmentId);
  }


  getEducationalTracks(): Observable<EducationalTrack[]> {
    return this.http.get<EducationalTrack[]>(this.baseUrl + 'GetEducationTracks');
  }

  getStudyLevels(): Observable<StudyLevel[]> {
    return this.http.get<StudyLevel[]>(this.baseUrl + 'GetStudyLevels');
  }

  getMaritalStatus() {
    return this.http.get(this.baseUrl + 'GetMaritalStatus');
  }

  savePreInscription(userToSave) {
    return this.http.post(this.baseUrl + 'SavePreInscription', userToSave);
  }

  addUser(userToSave, currentUserId) {
    return this.http.post(this.baseUrl + 'AddUser/' + currentUserId, userToSave);
  }

  operatorExist(operator) {
    return this.http.post(this.baseUrl + 'OperatorExist', operator);
  }

  maintenancierExist(maintenancier) {
    return this.http.post(this.baseUrl + 'MaintenancierExist', maintenancier);
  }

}
