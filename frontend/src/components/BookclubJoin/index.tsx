import { Club, User, Book } from "../types";
import CurrentBook from "./CurrentBook";
import BooksList from "./BooksList";
import '../../index.css';

export default function BookclubJoin(
    {club, currentBook, booksRead, wishlist, joinClub}
    :
    {
        club : Club,
        currentBook : Book,
        booksRead : Book[],
        wishlist : Book[],
        joinClub : () => void;
    }   
) {
    return (
        <div className="row">
            <div className="col-md-3 club-column">
                <div className='club-text club-profile-picture'>
                {(club.imageUrl && club.imageUrl !== "") ? 
                        <img src={club.imageUrl} alt={club.name} /> 
                        : <img src={require("../../images/BookclubDefault.jpeg")} alt={club.name} />}
                    <h3 className="club-heading">{club.name}</h3>
                    <div className="row club-members">
                            <p>Meeting location: {club.nextMeeting && club.nextMeeting.location}</p>
                        <div className="row">
                            <p>Next meeting: {" "}
                                {club.nextMeeting && club.nextMeeting.meetingDate && club.nextMeeting.meetingDate.toLocaleString('en-us', {  weekday: 'long' })}
                                {" "}
                                {club.nextMeeting && club.nextMeeting.meetingDate && club.nextMeeting.meetingDate.toLocaleString()} </p>
                        </div>
                        <div className="row mr-2 ">
                            <p>{club.members.length} members</p>
                    </div>
                        <button onClick={joinClub} className="btn">Join Club</button>
                    </div>
                </div>
            </div>
                <div className="col-md-9 club-bg">
                    <div className="row align-items-center ">
                        <div className="col-md-11 club-container">
                            <h4>About Us</h4>
                            <p>{club.description}</p>
                        </div>
                        <div className="col-md-11 club-container">
                            <h4>Our Current Read</h4>
                            <CurrentBook currBook={currentBook} />
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-11 club-container">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="m-0">Books We've Read</h4>
                            </div>
                            <BooksList books={booksRead} />
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-11 club-container">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="m-0">Book Wishlist</h4>
                            </div>
                            <BooksList books={wishlist} />
                        </div>
                    </div>
                </div>
            </div>
        );
}