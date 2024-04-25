import { Book, Club, ClubMeeting } from "../../types";
import { Link, useParams } from "react-router-dom";

export default function NextMeeting(
    {currentBook, club, meeting, isAdmin} 
    : 
    {currentBook : Book, club : Club, meeting : ClubMeeting, isAdmin:boolean}) {

    const { clubId } = useParams();
    console.log(clubId);
    console.log(meeting)



    return (
    <div>
        <div className="col-md-11 club-container">
            <h4>Next Meeting</h4>
            <p>{meeting.meetingDate.toLocaleString('en-us', {  weekday: 'long' })} {' '}
                {meeting.meetingDate.toLocaleString()}
                {/* {meeting.meetingDate.toLocaleTimeString()} */}
            </p>
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
        <div className="col-md-11 club-container">
            <p>Location: {meeting.location}</p>
        </div>
    </div>
    );
}