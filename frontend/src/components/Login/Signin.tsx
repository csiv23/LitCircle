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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signin = async () => {
        try {
            const user = await client.signin(credentials);
            console.log("Signin user: " + JSON.stringify(user));
            dispatch(setCurrentUser(user))
            navigate(`/myProfile/${user._id}`);
        }
        catch (err: any) {
            console.log(err.response.data.message);
        }
    }

    return (
        <div>
            <h1>Sign In</h1>
            <input value={credentials.email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })} />
            <input value={credentials.password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })} />
            <button onClick={signin}> Sign In </button>
        </div>
    )
}