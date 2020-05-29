// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  //firebaseConfig is the object that connects to the database
  firebaseConfig: {
    apiKey: "AIzaSyCEwegzsYx5z1NIUF1NRd-m2bhPSBnrzRE",
    authDomain: "project-sspis.firebaseapp.com",
    databaseURL: "https://project-sspis.firebaseio.com",
    projectId: "project-sspis",
    storageBucket: "project-sspis.appspot.com",
    messagingSenderId: "981601967045",
    appId: "1:981601967045:web:5944271294029ef24989ac"

  },

  googleMapsApi: {
    apiKey: "AIzaSyBMkmpcK2Ic4SezUQrh6SRVrMO_IRL043o"
  }


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
