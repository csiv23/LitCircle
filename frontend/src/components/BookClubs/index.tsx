import './index.css';
import { Link, useParams } from 'react-router-dom';
import { User, Book, Club, ObjectId } from "../types";
import Header from '../Header';
import { useState, useEffect } from 'react';
import * as mongooseClient from "../../mongooseClient";
import CurrentBook from './currentBook';
import BooksList from './BooksList';
import ClubMembersList from './ClubMembersList';

function BookClubs() {
    const { clubId } = useParams();
    const [club, setClub] = useState<any>({ _id: "" });
    const [clubOrganizer, setClubOrganizer] = useState<any>({ _id: "" });
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
    const [clubMembers, setClubMembers] = useState([] as User[]);

    const findClubById = async (clubId: ObjectId) => {
        const response = await mongooseClient.getBookClubById(clubId);
        setClub(response);
    };

    const findOrganizer = async () => {
        if (!clubId)
            return;
        const response = await mongooseClient.getClubOrganizer(clubId);
        setClubOrganizer(response);
    }

    const findCurrBook = async () => {
        if (!clubId)
            return;
        const response = await mongooseClient.getClubCurrentBook(clubId);
        setCurrBook(response);
    }

    const getBooksRead = async () => {
        if (!clubId)
            return;
        const response = await mongooseClient.getBooksReadByClub(clubId);
        setBooksRead(response);
    }

    const getWishlist = async () => {
        if (!clubId)
            return;
        const response = await mongooseClient.getWishlistByClub(clubId);
        setWishlist(response);
    }

    const getMembers = async () => {
        if (!clubId)
            return;
        const response = await mongooseClient.getMembersByClub(clubId);
        setClubMembers(response);
    }

    useEffect(() => {
        if (!clubId) return;
        findClubById(clubId);
        findOrganizer();
        findCurrBook();
        getBooksRead();
        getWishlist();
        getMembers();
    }, []);

    return (
        <div className="club-font">
            <Header />
            <div className="row">
                <div className="col-md-3 club-column">
                    <div className='club-text'>
                        <h3 className="club-heading">{club.name}</h3>
                        <br/>
                        <div className="row">
                            <h5>Organizer: {clubOrganizer.username} </h5>
                        </div>
                        <div className="row mr-2">
                            <p>Members: {clubMembers.length}</p>
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
                            <CurrentBook currBook={currBook} />
                        </div>
                        
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-11 club-container">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookClubs;