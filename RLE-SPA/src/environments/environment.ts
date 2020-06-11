// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/',
  adminTypeId: 4,
  operatortypeId: 3,
  hotlinetypeId: 5,
  maintenancierTypeId: 2,
  mainStores: [
    { value: 1, label: 'MAG AT' },
    { value: 2, label: 'MAG MORPHO' },
    { value: 4, label: 'MAG CEI' }
  ],
  atStoreId: 1,
  morhphoStoreId: 2,
  ceiStoreId: 4,
  defaultLink : 'http://localhost:4200/'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
