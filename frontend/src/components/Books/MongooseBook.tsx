import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './index.css';
import { Book, Club, User} from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";
import Header from "../Header";
import { useSelector } from "react-redux";


export default function MongooseBook(
    {book, currentUser, clubsReading, bookInBooksRead, bookInWishlist, userClubsWithoutRecs,
        recommendBookToClub, toggleBookInBooksRead, toggleBookInWishlist
    } 
    : 
    {   
        book : Book, 
        currentUser : User
        clubsReading: Club[],
        bookInBooksRead: boolean,
        bookInWishlist: boolean,
        userClubsWithoutRecs: Club[],
        recommendBookToClub: (clubId:string) => void;
        toggleBookInWishlist: () => void;
        toggleBookInBooksRead: () => void;

    }) {
    
    // const [addBookOpen, setAddBookOpen] = React.useState(false);
    // const [recClubOpen, setRecClubOpen] = React.useState(false);


    // console.log(addBookOpen);
    console.log(currentUser);
    // const handleAddBookOpen = () => setAddBookOpen(!addBookOpen);

    //   const handleRecClubOpen = () => setRecClubOpen(!recClubOpen);

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
                        <div >
                            {/* <button className="btn btn-secondary dropdown-toggle" onClick={handleAddBookOpen}>
                                Add Book to ...
                            </button> */}

                                <ul className="">
                                    <li className="">
                                        <button onClick={toggleBookInBooksRead}> 
                                            {bookInBooksRead ? "Remove from" : "Add to" }  Books I've Read
                                        </button>
                                    </li>
                                    <li className="">
                                        <button onClick={toggleBookInWishlist}> 
                                            {bookInWishlist ? "Remove from" : "Add to" }  Books I Want to Read
                                        </button>
                                    </li>
                                </ul>

                        </div>
                        <div >
                            {/* <button className="btn btn-secondary dropdown-toggle" onClick={handleRecClubOpen}>
                                Recommend Book to Club 
                            </button> */}
                                <ul >
                                    {userClubsWithoutRecs.map((club : Club) => {
                                        if (club) {
                                            return ( <li key={club._id}>
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
