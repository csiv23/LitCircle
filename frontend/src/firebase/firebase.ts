import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// If you want to add more firebase services, add them here

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI55_e9W5BiV6U0KO3bRue8j14TmiZztE",
  authDomain: "litcircle-webdev.firebaseapp.com",
  projectId: "litcircle-webdev",
  storageBucket: "litcircle-webdev.appspot.com",
  messagingSenderId: "7602015232",
  appId: "1:7602015232:web:00b2500cab06b9b8151ce5",
  measurementId: "G-KM2WKWPE1R"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);