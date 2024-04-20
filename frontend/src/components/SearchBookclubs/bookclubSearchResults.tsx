import { Book, Club, ObjectId } from "../types";
import { Link } from "react-router-dom";

function BookclubResults(
{ clubs } : 
{ clubs: any[] }
) {

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
