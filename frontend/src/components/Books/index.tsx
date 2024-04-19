import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book, Club } from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";
import MongooseBook from "./MongooseBook";

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
        <div>
            <MongooseBook book={book}/>
        </div>

    );
}
