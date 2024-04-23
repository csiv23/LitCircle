import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../../../../mongooseClient";
import { User } from "../../../types";
import { useDispatch, useSelector } from "react-redux";

export default function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            const userSession = await client.profile();
            setCurrentUser(userSession);

        }
        fetchProfile();
        // console.log("EditProfile currentUser: " + JSON.stringify(currentUser));
    }, [])

    // Updates the user's username and password
    const updateProfile = async () => {
        await client.updateUserProfile(userId, currentUser.username, currentUser.password);
        // dispatch(setCurrentUser(updatedUser));
        navigate(`/myProfile/${userId}`);
    }



    console.log("EditProfile currentUser: " + JSON.stringify(currentUser));
    return (
        <div>
            <h1>Edit Profile</h1>
            {userId && (
                <div>
                    Username:
                    <input value={currentUser?.username} onChange={(e) =>
                        setCurrentUser({...currentUser, username: e.target.value})} />
                    Password:
                    <input value={currentUser?.password} onChange={(e) =>
                        setCurrentUser({...currentUser, password: e.target.value})} />
                    <br />
                    <br />
                    <button onClick={updateProfile}> Save Changes </button>
                </div>
            )}
        </div>
    )
}