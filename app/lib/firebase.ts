// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDKa1y-t8ouewErj0gjMVYYgTNe3d25FIc',
  authDomain: 'one-c-table.firebaseapp.com',
  projectId: 'one-c-table',
  storageBucket: 'one-c-table.appspot.com',
  messagingSenderId: '154090780350',
  appId: '1:154090780350:web:a90e5710ca68e121d690ef',
  measurementId: 'G-7X5SLC9RTM',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// FIXME: move to a differnt file?
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);
