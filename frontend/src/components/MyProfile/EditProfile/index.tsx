import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../../../mongooseClient";
import { User } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../../reducers/usersReducer";

export default function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId } = useParams();
    const currentUser = useSelector((state: any) => state.users.currentUser);
    const [updatedUser, setUpdatedUser] = useState(currentUser);

    // Updates the user's username and password
    const updateProfile = async () => {
        await client.updateUserProfile(userId, updatedUser.username, updatedUser.password);
        dispatch(setCurrentUser(updatedUser));
        navigate(`/myProfile/${userId}`);
    }

    console.log("EditProfile currentUser: " + JSON.stringify(currentUser));
    return (
        <div>
            <h1>Edit Profile</h1>
            {userId && (
                <div>
                    Username:
                    <input value={updatedUser?.username} onChange={(e) =>
                        setUpdatedUser({...updatedUser, username: e.target.value})} />
                    Password:
                    <input value={updatedUser?.password} onChange={(e) =>
                        setUpdatedUser({...updatedUser, password: e.target.value})} />
                    <br />
                    <br />
                    <button onClick={updateProfile}> Save Changes </button>
                </div>
            )}
        </div>
    )
}