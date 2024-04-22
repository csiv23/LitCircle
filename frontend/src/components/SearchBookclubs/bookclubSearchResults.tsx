import { useEffect, useState } from "react";
import { Book, Club, ObjectId, User } from "../types";
import { Link } from "react-router-dom";
import * as client from "../../mongooseClient";

function BookclubResults(
{ clubs } : 
{ clubs: any[] }
) {

    const [currentUser, setCurrentUser] = useState<User>();
    useEffect(() => {
        const fetchProfile = async () => {
            const userSession = await client.profile();
            setCurrentUser(userSession);
        }
        fetchProfile();
    }, [])
    console.log("BookclubResults currentUser: " + JSON.stringify(currentUser));

    return (<div className="">
    {clubs.map((club: Club) => {
        if (club) {
            return (
                <div key={club._id} className="club">
                    <Link to={`/bookclub/${club._id}`}>
                        <div>
                            {(club.imageUrl && club.imageUrl !== "") ? 
                            <img src={club.imageUrl} alt={club.name} className="club-cover" /> 
                            : <img src={require("../../images/BookclubDefault.jpeg")} alt={club.name} />}
                        </div>
                        <h5>{club.name}</h5>
                    </Link>
                </div>
            );
        } else {
            return (
                <div key={club}>
                    <p>Club with ID {club} not found.</p>
                </div>
            );
        }
    })}
</div>)
}

export default BookclubResults;
