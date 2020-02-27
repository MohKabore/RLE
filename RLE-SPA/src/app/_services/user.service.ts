import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Region } from '../_models/region';
import { TypeEmp } from '../_models/type-emp';
import { Department } from '../_models/department';
import { City } from '../_models/city';
import { EducationalTrack } from '../_models/educational-track';
import { StudyLevel } from '../_models/study-level';
// import { Message } from '../_models/message';
// import { Absence } from '../_models/absence';
// import { UserSanction } from '../_models/userSanction';
// import { UserReward } from '../_models/userReward';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  sexe = [{ id: 0, name: ' FEMME' }, { id: 1, name: ' HOMME' }];

  constructor(private http: HttpClient) { }

  getUsers1(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUsers() {
    return this.http.get(this.baseUrl + 'users');
  }

  getUsersWithRoles() {
    return this.http.get(this.baseUrl + 'users/usersWithRoles');
  }

  updateUserRoles(user: User, roles: {}) {
    return this.http.post(this.baseUrl + 'users/editRoles/' + user.userName, roles);
  }

  // saveAbsence(absence: Absence) {
  //   return this.http.put(this.baseUrl + 'users/saveAbsence', absence);
  // }


  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  SetMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }
  // // enregistrement d'un nouveau teacher
  // addUser(user: User) {
  //   return this.http.post(this.baseUrl + 'users/' + 'AddUser', user);
  // }

  // getUserByTypeId(id: number) {
  //   return this.http.get(this.baseUrl + 'users/' + 'GetUserByTypeId/' + id);
  // }
  // // supprimer un professeur
  // // recuperation de tous les userTypes avec details
  // getUserTypesDetails() {
  //   return this.http.get(this.baseUrl + 'users/GetUserTypesDetails');
  // }

  // recupeation des types User pour le personnel

  // mise a jour du userTypes
  // updateUserType(id: number, typeName: string) {
  //   return this.http.post(this.baseUrl + 'users/' + id + '/updateUserType/' + typeName, {});
  // }

  // // add usertypes
  // addUserType(userType: any) {
  //   return this.http.post(this.baseUrl + 'users/AddUserType', userType);
  // }

  // deleteUSerType(id: number) {
  //   return this.http.post(this.baseUrl + 'users/' + id + '/DeleteUserType', {});
  // }
  // updatePerson(id: number, user: any) {
  //   return this.http.post(this.baseUrl + 'users/' + id + '/updatePerson', user);
  // }

  getAllRegionsOpDetails(): Observable<Region[]> {
    return this.http.get<Region[]>(this.baseUrl + 'users/AllRegionOpDetails');
  }

  searchUsers(data: any) {
    return this.http.post(this.baseUrl + 'users/SearchUsers', data);
  }

  // recuperation de toutes les villes
  getAllCities() {
    return this.http.get(this.baseUrl + 'users/GetAllCities');
  }

  // recuperation des districts en fonction de  l'id de la ville
  getDistrictsByCityId(id: number) {
    return this.http.get(this.baseUrl + 'users/' + id + '/GetDistrictsByCityId');
  }
  getSelectedMaintsByRegionId(regionId: number) {
    return this.http.get(this.baseUrl + 'users/' + regionId + '/GetSelectedMaintsByRegionId');
  }

  getTrainingDetails(trainingid: number) {
    return this.http.get(this.baseUrl + 'users/' + trainingid + '/GetTrainingDetails');
  }

  getTrainingsBYRegionId(regionId: number) {
    return this.http.get(this.baseUrl + 'users/' + regionId + '/GetTrainingClassesByRegionId');
  }
  searchEmps(params) {
    return this.http.post(this.baseUrl + 'users/SearchNewEmps', params);
  }

  searchPreSelectedEmps(params) {
    return this.http.post(this.baseUrl + 'users/SearchPreSelectedEmps', params);
  }

  saveUserAssignAccount(userIds, insertUserId) {
    return this.http.post(this.baseUrl + 'users/SaveUserAssignAccount/' + insertUserId, userIds);
  }

  savePreSelection(userIds, insertUserId) {
    return this.http.post(this.baseUrl + 'users/SavePreSelection/' + insertUserId, userIds);
  }

  addUserToClass(traingClassid, userIds, insertUserId) {
    return this.http.post(this.baseUrl + 'users/' + traingClassid + '/AddUsersToClass/' + insertUserId, userIds);
  }

  removeUserToClass(traingClassid, userIds, insertUserId) {
    return this.http.post(this.baseUrl + 'users/' + traingClassid + '/RemoveUsersToClass/' + insertUserId, userIds);
  }


  addTraining(training, insertUserId) {
    return this.http.post(this.baseUrl + 'users/AddTraining/' + insertUserId, training);
  }

  addtrainingClass(trainingClass, insertUserId) {
    return this.http.post(this.baseUrl + 'users/AddtrainingClass/' + insertUserId, trainingClass);
  }

  editTraining(training, trainingId, insertUserId) {
    return this.http.put(this.baseUrl + 'users/EditTraining/' + trainingId + '/' + insertUserId, training);
  }

  deleteTraining(trainingId, insertUserId) {
    return this.http.post(this.baseUrl + 'users/DeleteTraining/' + trainingId + '/' + insertUserId, {});
  }

  editTrainingClass(trainingClass, trainingClassId, insertUserId) {
    return this.http.put(this.baseUrl + 'users/EditTrainingClass/' + trainingClassId + '/' + insertUserId, trainingClass);
  }

  regionOpDetails(regionId: number): Observable<Region> {
    return this.http.get<Region>(this.baseUrl + 'users/' + regionId + '/GetRegionRegistrationDetails');
  }

  allRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.baseUrl + 'users/AllRegions');
  }

  updateRegionState(regionId: number) {
    return this.http.put(this.baseUrl + 'users/' + regionId + '/UpdateRegionState', {});
  }

  updateDepartmentState(departmentId: number) {
    return this.http.put(this.baseUrl + 'users/' + departmentId + '/UpdateDepartmentState', {});
  }

  updateCityState(cityId: number) {
    return this.http.put(this.baseUrl + 'users/' + cityId + '/UpdateCityState', {});
  }

  updateCityQuota(cityId, quota: number) {
    return this.http.post(this.baseUrl + 'users/' + cityId + '/UpdateCityQuota/' + quota, {});
  }

  getTrainingClassDetails(trainingClassId) {
    return this.http.get(this.baseUrl + 'users/TrainingClassDetails/' + trainingClassId);
  }

  getTrainingClassParticipants(trainingClassId) {
    return this.http.get(this.baseUrl + 'users/TrainingClassParticipants/' + trainingClassId);
  }

  deleteTrainingClass(trainingClassid,  insertUserId) {
    return this.http.put(this.baseUrl + 'users/' + trainingClassid + '/DeleteTrainingClass/' + insertUserId, {});
  }

}
