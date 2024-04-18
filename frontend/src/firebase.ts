import { initializeApp } from "firebase/app";
import { Auth, getAuth, updateEmail, updatePassword } from "firebase/auth";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import { useState } from "react";

// Your web app's Firebase configuration
// TODO: Put the apiKey in ENV
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

export const signIn = async (email: string, password: string) => {
  // Firebase's signIn function
  signInWithEmailAndPassword(firebaseAuth, email, password)
  .then((userCredentials) => {
      console.log(`Signed In! UserCredentials: ${JSON.stringify(userCredentials.user)}`);
  })
  .catch((error) => {
      console.log(error);
  });
}

export const signUp = async (email: string, password: string) => {
  let authUserId = "";
  // Firebase's register function
  await createUserWithEmailAndPassword(firebaseAuth, email, password)
  .then((userCredentials) => {
    authUserId = userCredentials.user.uid;
    console.log(`Signed Up! UserCredentials: ${JSON.stringify(userCredentials.user)}`);
    // console.log(userCredentials.user);
  })
  .catch((error) => {
    console.log(error);
  });

  const userData = {
      Username: "Axios_Username",
      Password: password,
      Email: email,
      role: 'axios_role',
      uid: authUserId
  }

  // Sending POST request to MongoDB endpoint to create new user
  const response = await axios.post(`http://localhost:4000/api/users/register`, userData);
  console.log(`Registered user via Axios POST request. MongoDB Response: ${JSON.stringify(response.data)}`);
}

export const logout = async (auth: Auth) => {
  await signOut(auth);
}

// export const updateUserEmail = async (email: string) => {
//   if (firebaseAuth.currentUser) {
//     updateEmail(firebaseAuth.currentUser, email).then(() => {
//       console.log("Updated email in Firebase!");
//     }).catch((error) => {
//       console.log(error);
//     });
//   }
// }

export const updateUserPassword = async (password: string) => {
  if (firebaseAuth.currentUser) {
    updatePassword(firebaseAuth.currentUser, password).then(() => {
      console.log("Updated password in Firebase!");
    }).catch((error) => {
      console.log(error);
    });
  }
}