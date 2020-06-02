import { Photo } from './photo';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  gender: number;
  secondPhoneNumber: string;
  dateOfBirth: Date;
  created: Date;
  lastActive: Date;
  idnum: string;
  tabletId: number;
  tabletImei: string;
  enrolmentCenterId: number;
  enrolmentCenterName: string;
  typeEmpId: number;
  typeEmpName: string;
  regionId: number;
  regionName: string;
  departmentId: number;
  departmentName: string;
  resCityId: number;
  resCityName: string;
  municipalityId: number;
  municipalityName: string;
  birthDate: Date;
  maritalStatusId: number;
  maritalStatusName: string;
  nbChild: number;
  birthPlace: string;
  cni: string;
  passport: string;
  iddoc: string;
  atnum: string;
  studyLevelId: number;
  studyLevelName: string;
  educationalTrackId: number;
  educationalTrackIName: string;
  hired: number;
  insertDate: Date;
  photoUrl: string;
  userTyepId: number;
  photos?: Photo[];
  roles?: string[];
  preSelected: boolean;
  selected: boolean;
  reserved: boolean;
  active: boolean;
  sel: boolean;
  nok: number;

  step: number;


}
