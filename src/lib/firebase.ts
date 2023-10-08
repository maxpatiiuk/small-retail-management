// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

/**
 * Before putting credentials here, make sure to enable API key restrictions:
 * https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions
 *
 * Restrict to "Cloud Firestore API", "Identity Toolkit API" and
 * "Token Service API" APIs
 * Also, restrict to the domain of your app
 */
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
