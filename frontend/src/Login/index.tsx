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
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                setAuthUser(user);
                setIsLoggedIn(true);
                console.log("Signed in! uid: " + user.uid);
                console.log(user);
            }
            else {
                setIsLoggedIn(false);
                console.log("Not signed in");
            }
        });
        // Cleanup function
        return () => unsubscribe();
    }, [])

    const signIn = async () => {
        signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCredentials) => {
            console.log(userCredentials);
        })
        .catch((error) => {
            console.log(error);
        });

        const response = await axios.get(`http://localhost:3001/api/users/6612e6d0f74acd763f3a7ccb`);
        console.log(`Got the user from MongoDB via axios!: ${JSON.stringify(response.data)}`);
    }
    const signUp = async () => {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCredentials) => {
            console.log(userCredentials);
        })
        .catch((error) => {
            console.log(error);
        });

        const userData = {
            Username: "Axios_Username4",
            Password: password,
            Email: email,
            role: 'axios_role',
            uid: authUser?.uid
        }
        const response = await axios.post(`http://localhost:3001/api/users/register`, userData);
        console.log(`Sent axios post request to register user. Response: ${response.data}`);
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