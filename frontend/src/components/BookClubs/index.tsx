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
import { current } from '@reduxjs/toolkit';
import AdminLeave from '../AdminLeave/adminleave';
import Delete from './Delete';

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
    const [isAdmin, setIsAdmin] = useState(false);
    const [removedItem, setRemovedItem] = useState(true);

    const leaveClub = async () => {
        if (clubId && currentUser && currentUser._id) {
            if (isAdmin) {
                navigate(`/bookclub/${clubId}/leave`);
            }
            else {
                await mongooseClient.leaveClub(clubId, currentUser._id);
                setUserInClub(false);
                navigate(`/profile/${currentUser._id}`);
            }
        }   
    }

    const appointAsOrganizer = async (userId : string) => {
        if (clubId && currentUser && currentUser._id) {
            await mongooseClient.leaveClub(clubId, currentUser._id, userId);
            setUserInClub(false);

            navigate(`/profile/${currentUser._id}`);
        }
    }

    const removeUser = async (userId : string) => {
        if (clubId) {
            await mongooseClient.leaveClub(clubId, userId);
            setClubMembers(clubMembers.filter(user => user._id !== userId));
            setRemovedItem(true);
            console.log(removedItem);
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

    const removeFromWishlist = async (bookId : string) => {
        if (clubId) {
            await mongooseClient.removeBookFromClubWishlist(clubId, bookId);
            const newWishlist = await mongooseClient.getWishlistByClub(clubId);
            setWishlist(newWishlist);
        }
    }

    const markAsRead = async () => {
        if (clubId) {
            const updatedClub = await mongooseClient.markCurrentBookAsRead(clubId);
            setCurrBook({
                _id: "",
                googleBooksId: "",
                title: "Untitled",
                author: "N/A",
                coverImageUrl: "",
                description: "N/A",
                clubsReading: [],
              });
            setClub(updatedClub);
        }
    }

    const setCurrentBook = async (book : Book) => {
        if (clubId) {
            const mongooseBookId = await mongooseClient.createBook(book);
            await mongooseClient.setCurrentBook(clubId, mongooseBookId);
            const newCurrentBook = await mongooseClient.getClubCurrentBook(clubId);
            setCurrBook(newCurrentBook);
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

    const setup = async (clubId: ObjectId) => {
        try {
            const userSession = await mongooseClient.profile();
            setCurrentUser(userSession);
    
            if (userSession) {
                const currentClub = await mongooseClient.getBookClubById(clubId);
                setClub(currentClub);

                if (!currentClub || !currentClub._id) {
                    navigate('/club');
                }
    
                const currentMembers = await mongooseClient.getMembersByClub(clubId);
                setClubMembers(currentMembers);
    
                const userJoined = currentClub.members.includes(userSession._id);
                setUserInClub(userJoined);
    
                const userIsAdmin = currentClub.organizer === userSession._id;
                setIsAdmin(userIsAdmin);
    
                const currentOrganizer = await mongooseClient.getClubOrganizer(clubId);
                setClubOrganizer(currentOrganizer);
    
                const currentBook = await mongooseClient.getClubCurrentBook(clubId);
                setCurrBook(currentBook);
    
                const clubBooksRead = await mongooseClient.getBooksReadByClub(clubId);
                setBooksRead(clubBooksRead);
    
                const response = await mongooseClient.getWishlistByClub(clubId);
                setWishlist(response);
            }
        } catch (error : any) {
            console.error('Setup failed:', error);
            navigate('/bookclub');
        }
    }
    
    

    const fetchProfile = async () => {
        const userSession = await mongooseClient.profile();
        setCurrentUser(userSession);
    }


    const searchUsers = async (userQuery : string)  => {
        if (club._id) {
            const currentMembers = await mongooseClient.getMembersByClub(club._id);
            setClubMembers(currentMembers);
            setRemovedItem(true);
            if (currentMembers)
                return currentMembers.filter((currentMember : User) => currentMember.username.toLowerCase().startsWith(userQuery.toLowerCase()));
        }
        return [] as User[];
    }

    useEffect(() => {
        if (clubId) {
            console.log(clubId);
            setup(clubId);
        }
    }, [clubId, userInClub, isAdmin, removedItem]);


    if (!currentUser) {
        navigate("/login");
    }

    return (
        <div className="club-font">
            <Header />
            <div>
                { userInClub
                ? 
                <div className="row">
                    <ClubNav club={club}/>
                    <div className="col-md-9 club-bg">
                        <div className="row align-items-center">
                        <Routes>
                            <Route path="/" element={<Navigate to="about" />} />
                            <Route path="leave" element={<AdminLeave appointAsOrganizer={appointAsOrganizer}/>}/>
                            <Route path="about" element={<About 
                                club={club}
                                setClub={setClub}
                                updateClub={updateClub}
                                isAdmin={isAdmin}/>} />
                            <Route path="members" 
                            element={<Members leaveClub={leaveClub}/>} />
                            <Route path="currently-reading" 
                            element={<CurrentlyReading/>} />
                            <Route path="next-meeting" 
                            element={<NextMeeting
                                currentBook={currBook}
                                club={club}
                                isAdmin={isAdmin}
                                setClub={setClub}
                                updateClub={updateClub}
                            />} />
                            <Route path="books-read" 
                            element={<BooksRead/>} />
                            <Route path="wishlist" element={<Wishlist/>} /> 
                            <Route path="delete" element={<Delete/>} /> 
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
