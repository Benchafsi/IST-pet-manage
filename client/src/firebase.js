// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pet-manage-8fbce.firebaseapp.com",
  projectId: "pet-manage-8fbce",
  storageBucket: "pet-manage-8fbce.appspot.com",
  messagingSenderId: "735416714926",
  appId: "1:735416714926:web:e83ddea3302af62bd50f3f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);