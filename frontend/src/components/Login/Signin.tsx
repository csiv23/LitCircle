import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import * as client from "../../client";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function Signin() {
    const [credentials, setCredentials] = useState<User>({
        userId: "",
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
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signin = async () => {
        try {
            console.log("credentials" + JSON.stringify(credentials));
            const user = await client.signin(credentials);
            console.log("Signed in! User: " + JSON.stringify(user));
            setError("");
            navigate(`/myProfile/${user._id}`);
        }
        catch (err: any) {
            setError(err.response.data.message);
        }
    }

    return (
        <div>
            <h1>Sign In</h1>
            {error && <div>{error}</div>}
            <input value={credentials.email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })} />
            <input value={credentials.password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })} />
            <button onClick={signin}> Sign In </button>
        </div>
    )
}