import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import * as client from "../../mongooseClient";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState<User>({
        _id: "",
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        followers: [],
        following: [],
        wishlist: [],
        booksRead: [],
        bookClubs: [],
        avatar: ""
    });
    const signup = async () => {
        try {
            console.log("credentials" + JSON.stringify(credentials));
            const user = await client.signup(credentials);
            console.log("Signed in!");
            dispatch(setCurrentUser(user));
            navigate('/home');
        }
        catch (err: any) {
            console.log(err.response.data.message);
        }
    }

    return (
        <div className="signin-container">
            <h2>Sign Up</h2>
            <input value={credentials.firstName} placeholder="First Name" onChange={(e) =>
                setCredentials({ ...credentials, firstName: e.target.value })} />
            <input value={credentials.lastName} placeholder="Last Name" onChange={(e) =>
                setCredentials({ ...credentials, lastName: e.target.value })} />
            <input value={credentials.username} placeholder="Username" onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })} />
            <input value={credentials.email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })} />
            <input value={credentials.password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })} />
            <button onClick={signup}> Sign Up </button>
        </div>
    )
}