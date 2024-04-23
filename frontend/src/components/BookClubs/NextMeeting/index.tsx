import { Book, Club, ClubMeeting } from "../../types";
import { Link, useParams } from "react-router-dom";
import {  } from "react-router-dom";

export default function NextMeeting(
    {currentBook, club, meeting} 
    : 
    {currentBook : Book, club : Club, meeting : ClubMeeting}) {

    const { clubId } = useParams();
    console.log(clubId);
    console.log(meeting)



    return (
    <div>
        <div>
            <h4>Next Meeting</h4>
            <p>{meeting.meetingDate.toLocaleString('en-us', {  weekday: 'long' })}
                {meeting.meetingDate.toLocaleString()}
                {/* {meeting.meetingDate.toLocaleTimeString()} */}
            </p>
        </div>
        <div key={currentBook._id} className="book">
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
        <div><p>{meeting.location}</p></div>
    </div>
    );
}