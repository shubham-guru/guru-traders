import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';


const firebaseConfig = {
  apiKey: "AIzaSyBGWozWNprV0-8E4cpSwCR-V_s5J0I8hs4",
  authDomain: "guru-traders-d3c0c.firebaseapp.com",
  databaseURL: "https://guru-traders-d3c0c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "guru-traders-d3c0c",
  storageBucket: "guru-traders-d3c0c.appspot.com",
  messagingSenderId: "547171339661",
  appId: "1:547171339661:web:48c471dff0573e0b63c1c4"
};

firebase.initializeApp(firebaseConfig);

export default firebase;