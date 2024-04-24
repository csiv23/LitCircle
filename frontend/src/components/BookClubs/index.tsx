import './index.css';
import { Link, useNavigate, useParams, Routes, Route, Navigate } from 'react-router-dom';
import { User, Book, Club, ObjectId } from "../types";
import Header from '../Header';
import { useState, useEffect } from 'react';
import * as mongooseClient from "../../mongooseClient";
import CurrentlyReading from './CurrentlyReading';
import { useDispatch, useSelector } from 'react-redux';
import ClubNav from './ClubNav';
import About from './About';
import Login from '../Login';
import Members from './Members/ClubMembersList';
import NextMeeting from './NextMeeting';
import BooksRead from './BooksRead';
import Wishlist from './Wishlist';
import BookclubJoin from '../BookclubJoin';

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
    const [currBook, setCurrBook] = useState<Book>({  _id: "",
    googleBooksId: "",
    title: "Untitled",
    author: "N/A",
    coverImageUrl: "",
    description: "N/A",
    clubsReading: [],
    });
    const [booksRead, setBooksRead] = useState([] as Book[]);
    const [wishlist, setWishlist] = useState([] as Book[]);
    const [userInClub, setUserInClub] = useState(false);

    const leaveClub = async () => {
        if (clubId && currentUser && currentUser._id) {
            await mongooseClient.leaveClub(clubId, currentUser._id);
            setUserInClub(false);
            navigate(`/profile/${currentUser._id}`);
        }   
    }

    const addToWishlist = async (book : Book) => {
        if (clubId) {
            const mongooseBookId = await mongooseClient.createBook(book);
            // const mongooseBookData = await mongooseClient.getBookById(mongooseBookId);
            await mongooseClient.addToClubWishlist(clubId, mongooseBookId);
            const response = await mongooseClient.getWishlistByClub(clubId);
            setWishlist(response);
        }
    }

    const joinClub = async () => {
        if (clubId && currentUser && currentUser._id) {
            await mongooseClient.joinClub(clubId, currentUser._id);
            setUserInClub(true);
        }
    }

    const updateClub = async () => {
        console.log(club);
        const updatedClub = await mongooseClient.updateClub(club);
        setClub(updatedClub);
    }

    const setup = async (clubId : ObjectId) => {
        const userSession = await mongooseClient.profile();
        setCurrentUser(userSession);

        if (userSession) {
            const currentClub = await mongooseClient.getBookClubById(clubId);
            setClub(currentClub);
            console.log(currentClub)

            const currentMembers = await mongooseClient.getMembersByClub(clubId);
            setClubMembers(currentMembers);

            const userJoined = currentClub.members.includes(userSession._id)
            setUserInClub(userJoined)
            console.log("user in club: " + userJoined);

            const currentOrganizer = await mongooseClient.getClubOrganizer(clubId);
            setClubOrganizer(currentOrganizer);

            const currentBook = await mongooseClient.getClubCurrentBook(clubId);
            setCurrBook(currentBook);

            const clubBooksRead = await mongooseClient.getBooksReadByClub(clubId);
            setBooksRead(clubBooksRead);

            const response = await mongooseClient.getWishlistByClub(clubId);
            setWishlist(response);

        }
        else {
            navigate("/login");
        };
    }

    const fetchProfile = async () => {
        const userSession = await mongooseClient.profile();
        setCurrentUser(userSession);
    }

    useEffect(() => {
        if (clubId) {
            console.log(clubId);
            setup(clubId);
        }
    }, [clubId, userInClub]);

    if (!currentUser) {
        navigate("/login");
    }

    return (
        <div className="club-font">
            <Header />
            <div className="row">
                { userInClub
                ? 
                <div className="row">
                <ClubNav club={club}/>
                <div className="col-md-9 club-bg">
                    <div className="row align-items-center">
                    <Routes>
                        <Route path="/" element={<Navigate to="about" />} />
                        <Route path="about" element={<About 
                            club={club} 
                            currentUser={currentUser}
                            setClub={setClub}
                            updateClub={updateClub}/>} />
                        <Route path="members" 
                        element={<Members
                            members={clubMembers}
                            club={club}
                            currentUser={currentUser}
                            organizer={clubOrganizer}
                            leaveClub={leaveClub}
                        />} />
                        <Route path="currently-reading" 
                        element={<CurrentlyReading
                            currentBook={currBook}
                            club={club}
                        />} />
                        <Route path="next-meeting" 
                        element={<NextMeeting
                            currentBook={currBook}
                            club={club}
                            meeting={club.nextMeeting}
                        />} />
                        <Route path="books-read" 
                        element={<BooksRead
                            books={booksRead}
                            club={club} 
                        />} />
                        <Route path="wishlist" element={<Wishlist
                            books={wishlist}
                            club={club}
                            addToWishlist={addToWishlist}
                        />} /> 
                    </Routes>
                </div>
                </div>
            </div>
            :
            <BookclubJoin
                club={club}
                currentBook={currBook}
                booksRead={booksRead}
                wishlist={wishlist}
                joinClub={joinClub} /> }
            </div>
        </div>
    );
}

export default BookClubs; 
