// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCcIgmD-HTOrpKE9SP5_J6nxy5oQ8Hw1fE',
    authDomain: 'smcu-document-number.firebaseapp.com',
    databaseURL: 'https://smcu-document-number.firebaseio.com',
    projectId: 'smcu-document-number',
    storageBucket: 'smcu-document-number.appspot.com',
    messagingSenderId: '359100944323'
  },
  baseUrl: 'http://localhost:5002/smcu-document-number/us-central1'
};
