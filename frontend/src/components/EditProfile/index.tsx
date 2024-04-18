import { useSelector } from "react-redux";
import { useState } from "react";
import * as mongoClient from "../../client";
import * as firebaseClient from "../../firebase";

export default function EditProfile() {
    const currentUser = useSelector((state: any) => state.users.currentUser);
    const [updatedUser, setUpdatedUser] = useState(currentUser);

    console.log("EditProfile currentUser._id: " + currentUser._id);

    // Updates the user's username and password in BOTH mongoDB and firebase
    const updateProfile = async () => {
        await mongoClient.updateUserProfile(currentUser._id, updatedUser.Username, updatedUser.Password);
        console.log("Updated profile in MongoDB!");
        // TODO: Update the user's password in firebase
        firebaseClient.updateUserPassword(updatedUser.Password);
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            {currentUser && (
                <div>
                    Username:
                    <input value={updatedUser.Username} onChange={(e) =>
                        setUpdatedUser({ ...updatedUser, Username: e.target.value })} />
                    Password:
                    <input value={updatedUser.Password} onChange={(e) =>
                        setUpdatedUser({ ...updatedUser, Password: e.target.value })} />
                    <br />
                    <br />
                    <button onClick={updateProfile}> Save Changes </button>
                </div>
            )}
        </div>
    )
}