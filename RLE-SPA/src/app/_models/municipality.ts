
export class Municipality {
  public id: number;

  public cityId: number;

  public name: string;

  public code: string;

  public pollingPlaces: number;

  constructor(
    id?: number,
    cityId?: number,
    name?: string,
    code?: string,
    pollingPlaces?: number,
    ) {
    this.id = id || 0;
    this.cityId = cityId || null;
    this.name = name || '';
    this.code = code || '';
    this.pollingPlaces = pollingPlaces || 0;
  }
}
