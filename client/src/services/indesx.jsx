// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhJIgftJio4EcD6uxW0xQwUlyRbhR-4Lk",
  authDomain: "vansh-d5db9.firebaseapp.com",
  projectId: "vansh-d5db9",
  storageBucket: "vansh-d5db9.firebasestorage.app",
  messagingSenderId: "859465812604",
  appId: "1:859465812604:web:539cf4e9ed4dfebeb5d7f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
