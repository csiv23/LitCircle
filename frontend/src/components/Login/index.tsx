import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import * as firebaseClient from '../../firebase'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        // onAuthStateChanged is always listening for changes in authentication state
        // SO, authUser will always be up to date and you can just access information
        // about the current user via authUser
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                // Store the current user
                setAuthUser(user);
                setIsLoggedIn(true);
            }
            else {
                setIsLoggedIn(false);
            }
        });
        // Cleanup function
        return () => unsubscribe();
    }, [])
    
    return (
        <div>
            {isLoggedIn ? (
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
                    <button onClick={() => firebaseClient.signUp(email, password, authUser)}>Create Account</button>
                </>
            )}
        </div>
    )
}
export default Login;