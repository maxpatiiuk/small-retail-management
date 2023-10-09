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
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
