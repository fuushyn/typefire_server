import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui'


import express from 'express';

var router = express.Router();

const firebaseConfig = {
  apiKey: "AIzaSyCn9AyF2sQFt79xtGjV44lWXkmZGM9i_LY",
  authDomain: "typefire-b5442.firebaseapp.com",
  projectId: "typefire-b5442",
  storageBucket: "typefire-b5442.appspot.com",
  messagingSenderId: "641877678137",
  appId: "1:641877678137:web:c71f6a21951d1da07b15e8",
  measurementId: "G-4GHGS48F6J"
};

export const app = firebase.initializeApp(firebaseConfig);
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// function getUI(){

//   // #get


//   return ui

// }

/* GET home page. */
router.get('/app', function(req, res, next) {
  res.send('OK');
});

export default router;
