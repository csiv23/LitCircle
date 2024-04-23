import './index.css';
import { Link, useNavigate, useParams, Routes, Route, Navigate } from 'react-router-dom';
import { User, Book, Club, ObjectId } from "../types";
import Header from '../Header';
import { useState, useEffect } from 'react';
import * as mongooseClient from "../../mongooseClient";
import CurrentBook from './currentBook';
import BooksList from './BooksList';
import { useDispatch, useSelector } from 'react-redux';
import ClubNav from './ClubNav';
import About from './About';
import Login from '../Login';
import Members from './Members/ClubMembersList';

function BookClubs() {
    const navigate = useNavigate();
    const { clubId } = useParams();
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
    const [clubMembers, setClubMembers] = useState([] as User[]);
    const [clubOrganizer, setClubOrganizer] = useState<User>(
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

    const leaveClub = async () => {
        if (clubId && currentUser && currentUser._id) {
            await mongooseClient.leaveClub(clubId, currentUser._id);
            navigate(`/profile/${currentUser._id}`);
        }   
    }

    const setup = async (clubId : ObjectId) => {
        const userSession = await mongooseClient.profile();
        setCurrentUser(userSession);

        if (userSession) {
            const currentClub = await mongooseClient.getBookClubById(clubId);
            setClub(currentClub);

            const currentMembers = await mongooseClient.getMembersByClub(clubId);
            setClubMembers(currentMembers);

            const currentOrganizer = await mongooseClient.getClubOrganizer(clubId);
            setClubOrganizer(currentOrganizer);

        }
        else {
            navigate("/login");
        };
    }

    useEffect(() => {
        if (clubId) {
            setup(clubId);
        }

        
    }, []);

    return (
        <div className="club-font">
            <Header />
            <div className="row">
                <ClubNav club={club}/>
                <div className="col-md-9 club-bg">
                    <div className="row align-items-center">
                    <Routes>
                        <Route path="/" element={<Navigate to="about" />} />
                        <Route path="about" element={<About club={club}/>} />
                        <Route path="members" 
                        element={<Members
                            members={clubMembers}
                            club={club}
                            currentUser={currentUser}
                            organizer={clubOrganizer}
                            leaveClub={leaveClub}
                        />} />
                        {/* <Route path="currently-reading" element={<CurrentlyReading/>} />
                        <Route path="next-meeting" element={<Meetings/>} />
                        <Route path="books-read" element={<BooksRead/>} />
                        <Route path="wishlist" element={<Wishlist/>} /> */}
                    </Routes>
                        {/* <div className="col-md-11 club-container">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="m-0">Books We've Read</h4>
                                <button className="btn btn-primary book-btn">Add Book</button>
                            </div>
                            <BooksList books={booksRead} />
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-11 club-container">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="m-0">Book Wishlist</h4>
                                <button className="btn btn-primary book-btn">Add Book</button>
                            </div>
                            <BooksList books={wishlist} />
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-11 club-container">
                            <h4>Members</h4>
                            <ClubMembersList members={clubMembers} />
                        </div> */}
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default BookClubs;

// const [clubOrganizer, setClubOrganizer] = useState<any>({ _id: "" });
// const [currBook, setCurrBook] = useState<Book>({  _id: "",
//     googleBooksId: "",
//     title: "Untitled",
//     author: "N/A",
//     coverImageUrl: "",
//     description: "N/A",
//     clubsReading: [],
//  });
// const [booksRead, setBooksRead] = useState([] as Book[]);
// const [wishlist, setWishlist] = useState([] as Book[]);


// const findOrganizer = async () => {
//     if (!clubId)
//         return;
//     const response = await mongooseClient.getClubOrganizer(clubId);
//     setClubOrganizer(response);
// }

// const findCurrBook = async () => {
//     if (!clubId)
//         return;
//     const response = await mongooseClient.getClubCurrentBook(clubId);
//     setCurrBook(response);
// }

// const getBooksRead = async () => {
//     if (!clubId)
//         return;
//     const response = await mongooseClient.getBooksReadByClub(clubId);
//     setBooksRead(response);
// }

// const getWishlist = async () => {
//     if (!clubId)
//         return;
//     const response = await mongooseClient.getWishlistByClub(clubId);
//     setWishlist(response);
// }

// const getMembers = async () => {
//     if (!clubId)
//         return;
//     const response = await mongooseClient.getMembersByClub(clubId);
//     setClubMembers(response);
// }