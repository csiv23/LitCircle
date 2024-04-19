import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import * as client from "../../client";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function Signin() {
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
            <input value={credentials.Email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, Email: e.target.value })} />
            <input value={credentials.Password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, Password: e.target.value })} />
            <button onClick={signin}> Sign In </button>
        </div>
    )
}