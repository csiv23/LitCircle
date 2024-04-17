import { useSelector } from "react-redux";
import { User } from "../types";
import { useState } from "react";
import * as client from "../../client";

export default function EditProfile() {
    const currentUser = useSelector((state: any) => state.users.currentUser);
    const [updatedUser, setUpdatedUser] = useState(currentUser);

    console.log("EditProfile currentUser._id: " + currentUser._id);

    const updateProfile = async () => {
        console.log("Updating profile: " + JSON.stringify(updatedUser));
        await client.updateUserProfile(currentUser._id, currentUser.uid, updatedUser.Email, updatedUser.Password, updatedUser.Username);
        console.log("Saved profile!");
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            {currentUser && (
                <div>
                    Username:
                    <input value={updatedUser.Username} onChange={(e) =>
                        setUpdatedUser({ ...updatedUser, Username: e.target.value })} />
                    Email:
                    <input value={updatedUser.Email} onChange={(e) =>
                        setUpdatedUser({ ...updatedUser, Email: e.target.value })} />
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

// export default function EditProfile() {
//     const currentUser = useSelector((state: any) => state.users.currentUser);
//     const [updatedUser, setUpdatedUser] = useState<User | null>(currentUser);

//     const updateProfile = async () => {
//         if (updatedUser) {
//             await client.updateUserProfile(updatedUser);
//         }
//         else {
//             console.log("Failed to updateprofile");
//         }
//     }

//     return (
//         <div>
//             <h1>Edit Profile</h1>
//             {currentUser && (
//                 <div>
//                     <input value={updatedUser?.email} onChange={(e) =>
//                         setUpdatedUser({ ...updatedUser, Email: e.target.value })} />
//                     <input value={currentUser.Password} onChange={(e) =>
//                         setUpdatedUser({ ...updatedUser, Password: e.target.value })} />
//                     <button onClick={updateProfile}> Save </button>
//                 </div>
//             )}
//         </div>
//     )
// }