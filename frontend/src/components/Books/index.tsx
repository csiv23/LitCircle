import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book } from "../types";
import * as mongooseClient from "../../mongooseClient";
import Header from "../Header";

export default function Books() {
    const { bookId } = useParams<string>();
    const [book, setBook] = useState<any>({});
    const findBook = async (id: string) => {
      const googleBookData = await client.getBookDetails(id);
      console.log(googleBookData);
      const bookId = await mongooseClient.createBook(googleBookData);
      console.log(bookId);

      const mongooseBookData = await mongooseClient.getBookById(bookId);
      setBook(mongooseBookData as Book);
      console.log(mongooseBookData);
    };
    useEffect(() => {
      if (bookId) {
        findBook(bookId);
      }
    }, []);

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
                    <h4>Current Clubs Reading this Book</h4>
                    {book.currentClubs && 
                    <ul>
                        {book.currentClubs.map((club:string, index:number) => (
                            <li key={index}>{club}</li>
                        ))}
                    </ul>
                    }
                </div>
            </div>
        </div>
    );
}
