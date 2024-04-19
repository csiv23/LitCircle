import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import * as client from "../../client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState<User>({
        userId: "",
        Username: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
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
            navigate(`/myProfile/${user._id}`);
        }
        catch (err: any) {
            console.log(err.response.data.message);
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <input value={credentials.FirstName} placeholder="First Name" onChange={(e) =>
                setCredentials({ ...credentials, FirstName: e.target.value })} />
            <input value={credentials.LastName} placeholder="Last Name" onChange={(e) =>
                setCredentials({ ...credentials, LastName: e.target.value })} />
            <input value={credentials.Username} placeholder="Username" onChange={(e) =>
                setCredentials({ ...credentials, Username: e.target.value })} />
            <input value={credentials.Email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, Email: e.target.value })} />
            <input value={credentials.Password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, Password: e.target.value })} />
            <button onClick={signup}> Sign Up </button>
        </div>
    )
}