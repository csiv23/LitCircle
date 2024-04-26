import './index.css'
import { useEffect, useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../mongooseClient";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function Signin() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState(""); 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signin = async () => {
        try {
            const user = await client.signin(credentials);
            console.log("Signin user: " + JSON.stringify(user));
            dispatch(setCurrentUser(user))
            navigate('/home');
        }
        catch (err: any) {
            setError(err.response?.data.message || "Failed to sign in. Please check your credentials and try again.");
        }
    }

    return (
        <div className='signin-container'>
            <div className='signin-border-container'>
                <h2>Sign In</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <label htmlFor="signinInput"></label>
                <input 
                    value={credentials.email} 
                    id="signinInput"
                    placeholder="Email" 
                    type="email" 
                    onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })} />
                <input 
                    value={credentials.password} 
                    id="signinInput"
                    placeholder="Password" 
                    type="password" 
                    onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })} />
                <button onClick={signin}>Sign In</button>
            </div>
        </div>
    )
}
