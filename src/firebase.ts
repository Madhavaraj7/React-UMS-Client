// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "react-ums-693f1.firebaseapp.com",
  projectId: "react-ums-693f1",
  storageBucket: "react-ums-693f1.appspot.com",
  messagingSenderId: "569094902186",
  appId: "1:569094902186:web:6637ecb478d3d4faa41bd3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);