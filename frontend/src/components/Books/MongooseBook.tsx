import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book, Club } from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";

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
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                     <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                    : <img src={require("../../images/emptyBook.jpeg")} 
                    alt={book.title} className="book-cover"/>}
                </div>
                <div className="col-md-8">
                    <h2>{book.title}</h2>
                    <h3>Author: {book.author}</h3>
                    <p> Description: {book.description}</p>
                    <h4>Current Clubs Reading this Book</h4>
                    <ClubsReadingList clubs={clubsReading} />
                </div>
            </div>
        </div>
    );
}
