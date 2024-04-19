import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book } from "../types";
import * as mongooseClient from "../../mongooseClient";

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
