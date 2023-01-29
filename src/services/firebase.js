// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDs4qrUUxfAM1NWxLXg1jZt1vyg1vgc6Eg',
  authDomain: 'funkydmvisualnovel.firebaseapp.com',
  projectId: 'funkydmvisualnovel',
  storageBucket: 'funkydmvisualnovel.appspot.com',
  messagingSenderId: '44305573364',
  appId: '1:44305573364:web:6cae322dba15926e6b45a1',
  measurementId: 'G-K66E21RNE1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

export const auth = getAuth(app);
auth.useDeviceLanguage();

export const firestore = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
