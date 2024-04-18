import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import * as client from "../../client";

export default function Signup() {
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
    // const navigate = useNavigate();
    const signup = async () => {
        try {
            console.log("credentials" + JSON.stringify(credentials));
            // await client.signup(credentials);
            console.log("Signed in!");
            setError("");
            // TODO:
            // navigate("");
        }
        catch (err: any) {
            setError(err.response.data.message);
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <div>{error}</div>}
            <input value={credentials.email} placeholder="Email" type="email" onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })} />
            <input value={credentials.password} placeholder="Password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })} />
            <button onClick={signup}> Sign Up </button>
        </div>
    )
}