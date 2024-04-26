import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as mongooseClient from "../../../mongooseClient"
import { Club, User } from "../../types";

export default function Delete() {
    const {clubId} = useParams();
    const navigate = useNavigate();
    const [club, setClub] = useState<Club>({
        _id: "",
        name: "",
        description: "",
        members: [],
        booksRead: [],
        wishlist: [],
        currentBook: "",
        nextMeeting: {
          meetingDate: new Date(),
          location: ""
        },
        organizer: "",
        imageUrl: ""
      });
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
    

    const deleteClub = async () => {
        if (clubId && currentUser && currentUser._id) {        
            await mongooseClient.deleteClub(clubId);
            navigate(`/myProfile/${currentUser._id}`)
        }
    }

    useEffect(() => {
        const fetchClub = async () => {
            if (clubId) {
                const newClub = await mongooseClient.getBookClubById(clubId);
                setClub(newClub);

                const userSession = await mongooseClient.profile();

                if (userSession && userSession._id) {
                    setCurrentUser(userSession);
                }
                else {
                    navigate(`/bookclub/${newClub._id}/about`);
                }
            }
          
        }

       fetchClub();
    }, [clubId])

    return (
        <div>
            Are you sure you want to delete this club?
            <button onClick={deleteClub}>
                Yes
            </button>
            <button onClick={() => {navigate(`/bookclub/${clubId}`)}}>
                No
            </button>
        </div>
    )
}