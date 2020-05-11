import { Municipality } from './municipality';
import { User } from './user';

export class EnrolmentCenter {
  public id: number;

  public municipalityId: number;

  public name: string;

  public code: string;

  public displayCode: string;

  public municipality: Municipality;
  public operators: User[];

  constructor(
    id?: number,
    municipalityId?: number,
    name?: string,
    code?: string,
    displayCode?: string,
    municipality?: Municipality,
  ) {
    this.id = id || 0;
    this.municipalityId = municipalityId || null;
    this.name = name || '';
    this.code = code || '';
    this.displayCode = displayCode || '';
  }
}
