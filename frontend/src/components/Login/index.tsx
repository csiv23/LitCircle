import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import * as firebaseClient from '../../firebase'
import { useDispatch, useSelector } from "react-redux";
import Signin from "./Signin";
import { setCurrentUser } from "../../reducers/usersReducer";
import { useNavigate } from "react-router";
import MyProfile from "../MyProfile";
import * as client from "../../client";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [currentUser, setCurrentUser] = useState(null);
    const currentUserRedux = useSelector((state: any) => state.users.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = async () => {
        console.log("currentUser before logout: " + JSON.stringify(currentUser));
        setCurrentUser(await client.profile());
        console.log("currentUser after logout: " + JSON.stringify(currentUser));
        navigate("/login");
    }

    return (
        <div>
            {currentUser ? (
                <>
                    <p>You are logged in!</p>
                    {/* <button onClick={logout}>Logout</button> */}
                    
                </>
            ) : (
                <>
                    <div>
                        <Signin />
                    </div>
                </>
            )}
        </div>
        // <div>
        //     <Signin />
        // </div>
    )
}
export default Login;