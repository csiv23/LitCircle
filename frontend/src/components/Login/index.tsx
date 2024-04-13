import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import * as firebaseClient from '../../firebase'
import { useSelector } from "react-redux";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const currentUserId = useSelector((state: any) => state.users.currentUser);
    console.log(currentUserId);
    return (
        <div>
            {currentUserId ? (
                <>
                    <p>You are logged in!</p>
                    <button onClick={() => firebaseClient.logout(firebaseAuth)}>Logout</button>
                </>
            ) : (
                <>
                    <input value={email} type="email" placeholder="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}/>
                    <input value={password} type="password" placeholder="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    <button onClick={() => firebaseClient.signIn(email, password)}>Login</button>
                    <button onClick={() => firebaseClient.signUp(email, password)}>Create Account</button>
                </>
            )}
        </div>
    )
}
export default Login;