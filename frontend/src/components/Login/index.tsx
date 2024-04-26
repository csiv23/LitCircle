import './index.css'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Signin from "./Signin";
import { useNavigate } from "react-router";
import Signup from "./Signup";
import Header from '../Header';
import { User } from '../types';
import * as client from '../../mongooseClient';

function Login() {
    // const currentUser = useSelector((state: any) => state.users.currentUser);
    const [currentUser, setCurrentUser] = useState<User>();
    console.log("Login currentUser: " + JSON.stringify(currentUser));
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userSession = await client.profile();
            if (userSession) {
                navigate("/home")
            }
        } catch (error) {
            console.log("No user logged in");
        }
    }

    return (
        <div className='login'>
            <Signin />
            <Signup />
        </div>
    )
    // return (
    //     <div className='login'>
    //         {currentUser ? (
    //             <>
    //                 {navigate('/home')}
    //             </>
    //         ) : (
    //             <div>
    //                 {/* <Header /> */}
    //                 <Signin />
    //                 <Signup />
    //             </div>
    //         )}
    //     </div>
    // )
}
export default Login;