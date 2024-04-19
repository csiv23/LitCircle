import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book, Club } from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";
import Header from "../Header";


export default function MongooseBook({book} : {book : Book}) {
    const [clubsReading, setClubsReading] = useState([] as Club[]);

    const getClubsReading = async () => {
        if (!book._id)
            return;
        const response = await mongooseClient.getClubsReadingPerBook(book._id);
        console.log("club?")
        console.log(response);
        setClubsReading(response);
    }

    useEffect(() => {
      getClubsReading();
    }, [book._id]);

    return (
        <div className="book-font">
            <Header />
            <div className="row">
                <div className="col-md-4 book-column book-cover-lg">
                    {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                    <img src={book.coverImageUrl} alt={book.title} /> 
                    : <img src={require("../../images/emptyBook.jpeg")} 
                    alt={book.title}/>}
                </div>
                <div className="col-md-8 book-about-column">
                    <h2>{book.title}</h2>
                    <h4 className="book-author">By {book.author}</h4>
                    <p className="book-desc"> {book.description}</p>
                    <ClubsReadingList clubs={clubsReading} />
                </div>
            </div>
        </div>
    );
}
