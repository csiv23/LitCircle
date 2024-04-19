import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../../client";
import { User } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function EditProfile() {
    const { userId } = useParams();
    const currentUser = useSelector((state: any) => state.users.currentUser);
    const [updatedUser, setUpdatedUser] = useState(currentUser);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setCurrentUser(updatedUser));
    }, [updatedUser]);

    const navigate = useNavigate();
    // Updates the user's username and password
    const updateProfile = async () => {
        await client.updateUserProfile(userId, updatedUser.Username, updatedUser.Password);
        console.log("Updated profile in MongoDB!");
        dispatch(setCurrentUser(updatedUser));
        navigate(`/myProfile/${userId}`);
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            {userId && (
                <div>
                    Username:
                    <input value={updatedUser.Username} onChange={(e) =>
                        setUpdatedUser({...updatedUser, Username: e.target.value})} />
                    Password:
                    <input value={updatedUser.Password} onChange={(e) =>
                        setUpdatedUser({...updatedUser, Password: e.target.value})} />
                    <br />
                    <br />
                    <button onClick={updateProfile}> Save Changes </button>
                </div>
            )}
        </div>
    )
}