import { Region } from './region';
import { City } from './city';

export class Department {
  id: number;

  name: string;

  regionId: number;

  code: string;

  active: number;
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
  totalRegisteredPrct: number;
  totalReserveToHave:number;

  Region: Region;
  cities: City[];

}
