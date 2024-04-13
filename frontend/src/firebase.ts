import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";

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
      // console.log(`Signed In! UserCredentials: ${JSON.stringify(authUser)}`);
  })
  .catch((error) => {
      console.log(error);
  });

  // Sending GET request to MongoDB endpoint to retrieve user. Ideally, we'd like to use
  // the user's firebase uid rather than hardcoding their MongoDB user id
  const response = await axios.get(`http://localhost:4000/api/users/6612e6d0f74acd763f3a7ccb`);
  // console.log(`Got the user from MongoDB via axios! Response:${JSON.stringify(authUser)}`);
}

export const signUp = async (email: string, password: string, authUser: User | null) => {
  // Firebase's register function
  createUserWithEmailAndPassword(firebaseAuth, email, password)
  .then((userCredentials) => {
      console.log(`Signed Up! UserCredentials: ${JSON.stringify(userCredentials.user)}`);
  })
  .catch((error) => {
      console.log(error);
  });

  const userData = {
      Username: "Axios_Username",
      Password: password,
      Email: email,
      role: 'axios_role',
      uid: authUser?.uid
  }

  // Sending POST request to MongoDB endpoint to create new user
  const response = await axios.post(`http://localhost:4000/api/users/register`, userData);
  console.log(`Sent axios post request to register user! Response: ${JSON.stringify(response.data)}`);
}

export const logout = async (auth: Auth) => {
  await signOut(auth);
}