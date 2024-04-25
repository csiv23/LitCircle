import { Book, Club, ClubMeeting } from "../../types";
import { Link, useParams } from "react-router-dom";

export default function NextMeeting(
    {currentBook, club, isAdmin,
        updateClub,
        setClub
    } 
    : 
    {currentBook : Book, club : Club, isAdmin:boolean,
        updateClub : () => void,
        setClub : React.Dispatch<React.SetStateAction<Club>>
    }) {

    return (
    <div>
        <div className="col-md-11 club-container">
            <h4>Next Meeting</h4>
            <p>{club.nextMeeting.meetingDate.toLocaleString('en-us', {  weekday: 'long' })} {' '}
                {club.nextMeeting.meetingDate.toLocaleString()}
            </p>
           {isAdmin &&  <input type="datetime-local" value={club.nextMeeting.meetingDate.toISOString()}
                onChange={(e) => { setClub({...club, nextMeeting: {...club.nextMeeting, meetingDate: new Date(e.target.value)}})}}
            >
            </input>}
        </div>
        <div key={currentBook._id} className="col-md-11 club-container book">
            <Link to={`/book/${currentBook.googleBooksId}`}>
                <div>
                {(currentBook.coverImageUrl && currentBook.coverImageUrl !== "") ? 
                     <img src={currentBook.coverImageUrl} alt={currentBook.title} className="book-cover" /> 
                    : <img src={require("../../../images/emptyBook.jpeg")} alt={currentBook.title} />}
                </div>
                <h5 className="book-title">{currentBook.title}</h5>
                <p className="book-author">{currentBook.author}</p>
                <p className="book-author">{currentBook.description}</p>
            </Link>
        </div>
        <div><p>{club.nextMeeting.location}</p>  
            {isAdmin &&  <input value={club.nextMeeting.location}
                onChange={(e) => { setClub({...club, 
                    nextMeeting: {...club.nextMeeting, location: e.target.value}})}}
                >
                </input>}
        </div>
        {isAdmin && <button onClick={updateClub}>Save Changes</button>}
    </div>
    );
}