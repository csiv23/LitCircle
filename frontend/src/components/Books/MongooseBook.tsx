import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book, Club, User} from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";
import Header from "../Header";
import { useSelector } from "react-redux";


export default function MongooseBook({book, currentUser} : {book : Book, currentUser : User}) {
    const [clubsReading, setClubsReading] = useState([] as Club[]);
    const [addBookOpen, setAddBookOpen] = React.useState(false);
    const [recClubOpen, setRecClubOpen] = React.useState(false);
    const [bookInBooksRead, setBookInBooksRead] = useState(false);
    const [bookInWishlist, setBookInWishlist] = useState(false);
    const [userClubsWithoutRecs, setUserClubsWithoutRecs] = useState([] as Club[]);

    const handleAddBookOpen = () => {
        setAddBookOpen(open => !open);
        console.log("add book dropdown triggered: " + addBookOpen);
      };

      const handleRecClubOpen = () => {
        setRecClubOpen(open => !open);
        console.log("set rec dropdown triggered: " + recClubOpen);
      };

    const getClubsReading = async () => {
        if (!book._id)
            return;
        const response = await mongooseClient.getClubsReadingPerBook(book._id);
        console.log("club?")
        setClubsReading(response);
    }

    const checkUserAndBooklists = async () => {
        if (currentUser) {
            if (currentUser.booksRead) {
                setBookInBooksRead(currentUser.booksRead.includes(book._id));
            }

            if (currentUser.wishlist) {
                setBookInWishlist(currentUser.wishlist.includes(book._id));
            }
        }
    }

    const userClubsWithoutRecommendations = async () => {
        if (currentUser) {
            const clubs = await mongooseClient.getUserClubsWithoutBookRec(currentUser._id, book._id);
            console.log("clubs without recs");
            console.log(clubs);
            setUserClubsWithoutRecs(clubs);
        }

    }
    const recommendBookToClub = async (clubId : string) => {
        if (currentUser) {
            await mongooseClient.recommendBookToClub(clubId, book._id);
            setUserClubsWithoutRecs(userClubsWithoutRecs.filter(club=>club._id !== clubId));
        }
    }

    useEffect(() => {
      getClubsReading();
      checkUserAndBooklists();
      userClubsWithoutRecommendations();
    }, []);

    return (
        <div className="book-font">
            <div className="row">
                <div className="col-md-4 book-column book-cover-lg">
                        {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                        <img src={book.coverImageUrl} alt={book.title} /> 
                        : <img src={require("../../images/emptyBook.jpeg")} 
                        alt={book.title}/>}
                </div>
                <div className="col-md-8 club-bg">
                    <div className="row align-items-center ">
                        <div className="col-md-11 club-container">
                            <h2>{book.title}</h2>
                            <h4 className="book-author">By {book.author}</h4>
                            <p className="book-desc"> {book.description}</p>
                        </div>
                        <div className="col-md-11 club-container">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" onClick={handleAddBookOpen}>
                                Add Book to ...
                            </button>
                            {addBookOpen && (
                                <ul className="dropdown-menu">
                                    <li className="dropdown-item">
                                        <button onClick={() => {
                                            if (currentUser) { setBookInBooksRead(!bookInBooksRead) }
                                            }}> 
                                            {bookInBooksRead ? "Remove from" : "Add to" }  Books I've Read
                                        </button>
                                    </li>
                                    <li className="dropdown-item">
                                        <button onClick={() => {
                                            if (currentUser) {setBookInWishlist(!bookInWishlist) }
                                            }}> 
                                            {bookInWishlist ? "Remove from" : "Add to" }  Books I Want to Read
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" onClick={handleRecClubOpen}>
                                Recommend Book to Club 
                            </button>
                            {recClubOpen && (
                                <ul className="dropdown-menu">
                                    {userClubsWithoutRecs.map((club : Club) => {
                                        if (club) {
                                            return ( <li className="dropdown-item" key={club._id}>
                                            <button onClick={() => {recommendBookToClub(club._id)}}> 
                                               {club.name}
                                            </button>
                                            </li>
                                            )
                                        }
                                        else {
                                            return (
                                                <div key={club}>
                                                    <p>Club with ID {club} not found.</p>
                                                </div>
                                            );
                                        }
                                    })}
                                </ul>
                            )}
                        </div>
                        </div>
                        <div className="col-md-11 club-container">
                            <h4>Clubs That Have Recently Read This Book...</h4>
                            <ClubsReadingList clubs={clubsReading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
