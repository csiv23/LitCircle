import './index.css'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Signin from "./Signin";
import { useNavigate } from "react-router";
import Signup from "./Signup";
import Header from '../Header';

function Login() {
    const currentUser = useSelector((state: any) => state.users.currentUser);
    console.log("Login currentUser: " + JSON.stringify(currentUser));
    const navigate = useNavigate();
    return (
        <div className='login'>
            {currentUser ? (
                <>
                    {navigate('/home')}
                </>
            ) : (
                <div>
                    {/* <Header /> */}
                    <Signin />
                    <Signup />
                </div>
            )}
        </div>
    )
}
export default Login;