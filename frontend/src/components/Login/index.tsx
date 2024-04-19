import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Signin from "./Signin";
import { useNavigate } from "react-router";

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