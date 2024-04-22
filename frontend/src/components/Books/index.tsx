import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book, Club } from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";
import MongooseBook from "./MongooseBook";
import Header from "../Header";
import { useSelector } from "react-redux";

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
    const currentUser = useSelector((state: any) => state.users.currentUser);

    useEffect(() => {
      if (bookId) {
        findBook(bookId);
      }
    }, []);

    return (
        <div>
            <Header/>
            <MongooseBook book={book} currentUser={currentUser}/>
        </div>

    );
}
