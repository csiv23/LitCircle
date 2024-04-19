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
import Signup from "./Signup";

function Login() {
    const currentUser = useSelector((state: any) => state.users.currentUser);
    console.log("Login currentUser: " + JSON.stringify(currentUser));
    const navigate = useNavigate();
    return (
        <div>
            {currentUser ? (
                <>
                    {navigate(`/MyProfile/${currentUser._id}`)}
                </>
            ) : (
                <div>
                    <Signin />
                    <Signup />
                </div>
            )}
        </div>
    )
}
export default Login;