import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../../../../mongooseClient";
import { User } from "../../../types";
import { useDispatch, useSelector } from "react-redux";

export default function EditProfile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [currentUser, setCurrentUser] = useState<User>(
        {
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
            avatar: "",
        }
    );
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userSession = await client.profile();
                setCurrentUser(userSession);
            } catch (error) {
                navigate("/login");
            }
        }
        fetchProfile();
    }, [])

    // Updates the user's username and password
    const updateProfile = async () => {
        await client.updateUserProfile(userId, currentUser.username, currentUser.password);
        navigate(`/myProfile/${userId}`);
    }



    console.log("EditProfile currentUser: " + JSON.stringify(currentUser));
    return (
        <div>
            <h1>Edit Profile</h1>
            {userId && (
                <div>
                    Username:
                    <input value={currentUser.username} onChange={(e) =>
                        setCurrentUser({...currentUser, username: e.target.value})} />
                    Password:
                    <input value={currentUser.password} onChange={(e) =>
                        setCurrentUser({...currentUser, password: e.target.value})} />
                    <br />
                    <br />
                    <button onClick={updateProfile}> Save Changes </button>
                </div>
            )}
        </div>
    )
}