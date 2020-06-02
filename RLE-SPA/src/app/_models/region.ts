import { Department } from './department';

export class Region {
  public id: number;

  public name: string;

  public districtId: number;

  public code: string;
  totalSelected : number;
  totalReserved : number;
  public active: number;
  totalOnTraining: number;
  totalPreSelected: number;
  totalRegistered: number;
  nbEmpNeeded: number;
  prctRegistered: number;
  prctPreselected: number;
  prctOnTraining: number;
  prctSelected: number;
  activeforInscription: boolean;
  departments: Department[];


}
