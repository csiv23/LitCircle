import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import * as firebaseClient from '../../firebase'
import { useSelector } from "react-redux";
import EditProfile from "../EditProfile";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [isValidPassword, setIsValidPassword] = useState(true);
    const currentUser = useSelector((state: any) => state.users.currentUser);
    console.log(`currentUser: ${JSON.stringify(currentUser)}`);

    // const signin = (email: string, password: string) => {
    //     try {
    //         firebaseClient.signIn(email, password);
    //         setIsValidPassword(true);
    //     }
    //     catch (error) {
    //         setIsValidPassword(false);
    //     }
    // }
    return (
        <div>
            {currentUser ? (
                <>
                    <p>You are logged in!</p>
                    <button onClick={() => firebaseClient.logout(firebaseAuth)}>Logout</button>
                    <EditProfile />
                </>
            ) : (
                <>
                    <input value={email} type="email" placeholder="Email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }} />
                    <input value={password} type="password" placeholder="Password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }} />
                    {/* <button onClick={() => signin(email, password)}>Login</button> */}
                    {/* {!isValidPassword && <span>Incorrect Password</span>} */}
                    <button onClick={() => firebaseClient.signIn(email, password)}>Login</button>
                    <button onClick={() => firebaseClient.signUp(email, password)}>Create Account</button>
                </>
            )}
        </div>
    )
}
export default Login;