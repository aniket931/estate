// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-f0017.firebaseapp.com",
  projectId: "estate-f0017",
  storageBucket: "estate-f0017.appspot.com",
  messagingSenderId: "200056956178",
  appId: "1:200056956178:web:4ac15ac1bbb5da0d483fcb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);