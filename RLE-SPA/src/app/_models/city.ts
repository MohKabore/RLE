import { Department } from './department';

export class City {
  id: number;

  code: string;

  name: string;

  departmentId: number;

  cityTypeId: number;

  kits: number;

  pollingPlaces: number;

  nbEmpNeeded: number;

  active: number;
  Department: Department;
  totalOnTraining: number;
  totalPreSelected: number;
  totalRegistered: number;
  totalSelected: number;
  prctRegistered: number;
  prctPreselected: number;
  prctOnTraining: number;
  prctSelected: number;
  activeforInscription: boolean;
  totalRegisteredPrct: number;
  totalReserveToHave:number;

}
