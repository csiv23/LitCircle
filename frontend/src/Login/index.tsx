import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/firebase";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";

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

    const signIn = async () => {
        // Firebase's signIn function
        signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCredentials) => {
            console.log(`Signed In! UserCredentials: ${JSON.stringify(authUser)}`);
        })
        .catch((error) => {
            console.log(error);
        });

        // Sending GET request to MongoDB endpoint to retrieve user. Ideally, we'd like to use
        // the user's firebase uid rather than hardcoding their MongoDB user id
        const response = await axios.get(`http://localhost:3001/api/users/6612e6d0f74acd763f3a7ccb`);
        console.log(`Got the user from MongoDB via axios! Response:${JSON.stringify(authUser)}`);
    }
    const signUp = async () => {
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
        const response = await axios.post(`http://localhost:3001/api/users/register`, userData);
        console.log(`Sent axios post request to register user! Response: ${JSON.stringify(response.data)}`);
    }

    const logout = async () => {
        await signOut(firebaseAuth);
    }

    
    return (
        <div>
            {isLoggedIn ? (
                <>
                    <p>You are logged in!</p>
                    <button onClick={logout}>Logout</button>
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
                    <button onClick={signIn}>Login</button>
                    <button onClick={signUp}>Create Account</button>
                </>
            )}
        </div>
    )
}
export default Login;