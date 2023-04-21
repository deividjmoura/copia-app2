// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvCiPlbV_e4PKVp6ZCbsCtTcBmmaumC3g",
  authDomain: "copiaecia-app.firebaseapp.com",
  databaseURL: "https://copiaecia-app-default-rtdb.firebaseio.com",
  projectId: "copiaecia-app",
  storageBucket: "copiaecia-app.appspot.com",
  messagingSenderId: "373969538290",
  appId: "1:373969538290:web:19feff6c225c790c7b546b",
  measurementId: "G-DNBTP1K1D0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);