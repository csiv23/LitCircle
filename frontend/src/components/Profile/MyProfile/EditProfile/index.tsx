import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../../../../mongooseClient";
import { User } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import '../../index.css';

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
        <div className="profile-font profile-bg profile-desc">
            <h1>Edit Profile</h1>
            {userId && (
                <div>
                    <div className="edit-profile">
                        Username:
                        <label htmlFor="usernameInput"></label>
                        <input
                            id="usernameInput"
                            placeholder={currentUser.username} 
                            onChange={(e) =>
                            setCurrentUser({...currentUser, username: e.target.value})} />
                    </div>
                    <div className="edit-profile">
                        Password:
                        <label htmlFor="passwordInput"></label>
                        <input placeholder={currentUser.password} 
                            id="passwordInput"
                            onChange={(e) =>
                            setCurrentUser({...currentUser, password: e.target.value})} />
                    </div>
                    <button onClick={updateProfile} className="btn"> Save Changes </button>
                </div>
            )}
        </div>
    )
}