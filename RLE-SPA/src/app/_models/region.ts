import { Department } from './department';

export class Region {
  public id: number;

  public name: string;

  public districtId: number;

  public code: string;

  public active: number;
  totalOnTraining: number;
  totalPreSelected: number;
  totalRegistered: number;
  totalSelected: number;
  nbEmpNeeded: number;
  prctRegistered: number;
  prctPreselected: number;
  prctOnTraining: number;
  prctSelected: number;
  activeforInscription: boolean;
  departments: Department[];


}
