import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import * as client from "../../client";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function Signin() {
    const [credentials, setCredentials] = useState({
        Email: "",
        Password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signin = async () => {
        try {
            console.log("Signin credentials" + JSON.stringify(credentials));
            const user = await client.signin(credentials);
            console.log("Signed in! User: " + JSON.stringify(user));
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
            <input value={credentials.Email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, Email: e.target.value })} />
            <input value={credentials.Password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, Password: e.target.value })} />
            <button onClick={signin}> Sign In </button>
        </div>
    )
}