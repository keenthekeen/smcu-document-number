import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';

firebase.initializeApp(functions.config().firebase);

export const submit = functions.https.onRequest((req, res) => {

  if (req.method.toLowerCase() !== 'post') {
    if (req.method.toLowerCase() !== 'options') {
      res.status(405);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200);
    }
    res.end();
  } else {
    const data = req.body;
    const name = data.name;
    const divisionId = data.divisionId;
    const year = data.year;
    const category = data.category;
    const uid = data.uid;
    const nextNumberRef = firebase.database().ref(`data/documents/${year}/${category}/nextNumber`);
    nextNumberRef.once('value').then((_nextNumber) => {
      let nextNumber = _nextNumber.val();
      if (!nextNumber) {
        nextNumber = 1;
      }
      return nextNumber;
    }).then((nextNumber) => {
      return nextNumberRef.set(nextNumber + 1).then(() => nextNumber);
    }).then((nextNumber) => {
      return firebase.database().ref(`data/users/${uid}`).once('value').then((_v) => {
        const v = _v.val();
        return firebase.database().ref(`data/divisions/${divisionId}`).once('value').then((_d) => {
          const d = _d.val();
          return firebase.database().ref(`data/documents/${year}/${category}/documents`).push({
            number: nextNumber,
            name,
            user: v,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            division: d
          });
        });
      })
    }).then(() => {
      res.status(200)
      res.end()
    });
  }
});
