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
           {isAdmin &&  
            <label htmlFor="dateInput"><h5>Set Date and Time:</h5>
                <input type="datetime-local" 
                    value={club.nextMeeting.meetingDate.toISOString()}
                    id="dateInput"
                    placeholder="No date specified"
                    onChange={(e) => { setClub({...club, nextMeeting: {...club.nextMeeting, meetingDate: new Date(e.target.value)}})}}
                    >
            </input></label>}
        </div>
        <div key={currentBook._id} className="col-md-11 club-container book">
            <h5>Current Book:</h5>
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
        <div className="col-md-11 club-container book">
            {isAdmin &&  
                <label htmlFor="locationInput"><h5>Set Location:</h5>
                    <p>{club.nextMeeting.location}</p>  
                    <input value={club.nextMeeting.location}
                        id="locationInput"
                        placeholder="No Location"
                        onChange={(e) => { setClub({...club, 
                            nextMeeting: {...club.nextMeeting, location: e.target.value}})}}
                        >
                </input></label>}
        </div>
        <div className="col-md-11 club-container book">
            {isAdmin && <button onClick={updateClub} className="btn">Save Changes</button>}
        </div>
    </div>
    );
}