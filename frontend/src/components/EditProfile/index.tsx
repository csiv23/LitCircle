// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import * as client from "../../client";

// export default function EditProfile() {
//     const { userId } = useParams();
//     const [updatedUser, setUpdatedUser] = useState(null);

//     console.log("EditProfile currentUser._id: " + currentUser._id);

//     // Updates the user's username and password
//     const updateProfile = async () => {
//         await client.updateUserProfile(currentUser._id, updatedUser.Username, updatedUser.Password);
//         console.log("Updated profile in MongoDB!");
//     }

//     return (
//         <div>
//             <h1>Edit Profile</h1>
//             {userId && (
//                 <div>
//                     Username:
//                     <input value={updatedUser.Username} onChange={(e) =>
//                         setUpdatedUser({ ...updatedUser, Username: e.target.value })} />
//                     Password:
//                     <input value={updatedUser.Password} onChange={(e) =>
//                         setUpdatedUser({ ...updatedUser, Password: e.target.value })} />
//                     <br />
//                     <br />
//                     <button onClick={updateProfile}> Save Changes </button>
//                 </div>
//             )}
//         </div>
//     )
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../../client";
import { User } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";

export default function EditProfile() {
    const { userId } = useParams();
    // const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [updatedUser, setUpdatedUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const user = await client.profile();
            // setCurrentUser(user);
            setUpdatedUser(user);
        }
        fetchUser();
    }, []);

    // console.log("EditProfile currentUser._id: " + currentUser?.userId);

    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();
    // Updates the user's username and password
    const updateProfile = async () => {
        await client.updateUserProfile(userId, newUsername, newPassword);
        console.log("Updated profile in MongoDB!");
        navigate(`/myProfile/${userId}`)
    }
    const currentUserRedux = useSelector((state: any) => state.users.currentUser);
    const dispatch = useDispatch();
    
    
    console.log("CurrentUser: " + JSON.stringify(currentUserRedux));

    return (
        <div>
            <h1>Edit Profile</h1>
            {userId && (
                <div>
                    Username:
                    <input onChange={(e) =>
                        setNewUsername(e.target.value)} />
                    Password:
                    <input onChange={(e) =>
                        setNewPassword(e.target.value)} />
                    <br />
                    <br />
                    <button onClick={updateProfile}> Save Changes </button>
                </div>
            )}
        </div>
    )
}