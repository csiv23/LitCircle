import { useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";
import * as client from "../../client";

export default function Signup() {
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
    const signup = async () => {
        try {
            console.log("credentials" + JSON.stringify(credentials));
            const userId = await client.signup(credentials);
            console.log("Signed in!");
            setError("");
            navigate(`/myProfile/${userId}`);
        }
        catch (err: any) {
            setError(err.response.data.message);
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <div>{error}</div>}
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