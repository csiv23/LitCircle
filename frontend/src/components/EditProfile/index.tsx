import { useSelector } from "react-redux";
import { User } from "../types";
import { useState } from "react";
import * as client from "../../client";

export default function EditProfile() {
    const currentUser = useSelector((state: any) => state.users.currentUser);
    const [updatedUser, setUpdatedUser] = useState(currentUser);

    const updateProfile = async () => {
        console.log("Updating profile: " + JSON.stringify(updatedUser));
        await client.updateUserProfile(updatedUser);
        console.log("Saved profile!");
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            {console.log(updatedUser)}
            {currentUser && (
                <div>
                    <input  onChange={(e) =>
                        setUpdatedUser({ ...updatedUser, Email: e.target.value })} />
                    <input  onChange={(e) =>
                        setUpdatedUser({ ...updatedUser, Password: e.target.value })} />
                    <button onClick={updateProfile}> Save </button>
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