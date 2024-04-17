import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import * as firebaseClient from '../../firebase'
import { useSelector } from "react-redux";
import Signin from "./Signin";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const currentUser = useSelector((state: any) => state.users.currentUser);
    // console.log(`currentUser: ${JSON.stringify(currentUser["_id"])}`);
    return (
        <div>
            {currentUser ? (
                <>
                    <p>You are logged in!</p>
                    <button onClick={() => firebaseClient.logout(firebaseAuth)}>Logout</button>
                </>
            ) : (
                <>
                    <div>
                        <Signin />
                    </div>
                </>
            )}
        </div>
    )
}
export default Login;