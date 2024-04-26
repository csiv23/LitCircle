import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as client from '../SearchBooks/client';
import './index.css';
import { Book, Club, User } from "../types";
import * as mongooseClient from "../../mongooseClient";
import ClubsReadingList from "./ClubsReading";
import MongooseBook from "./MongooseBook";
import Header from "../Header";
import { useSelector } from "react-redux";
import NoBookFound from "./NoBookFound";

export default function Books() {
    const navigate = useNavigate();
    const { bookId } = useParams<string>();
    const [book, setBook] = useState<any>({});
    const [bookInBooksRead, setBookInBooksRead] = useState(false);
    const [bookInWishlist, setBookInWishlist] = useState(false);
    const [userClubsWithoutRecs, setUserClubsWithoutRecs] = useState([] as Club[]);
    const [clubsReading, setClubsReading] = useState([] as Club[]);
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

    const findBook = async (id: string) => {
      const googleBookData = await client.getBookDetails(id);
      console.log(googleBookData);

      if (googleBookData && googleBookData.googleBooksId) {
        const mongooseBookId = await mongooseClient.createBook(googleBookData);
        console.log(mongooseBookId);
  
        const mongooseBookData = await mongooseClient.getBookById(mongooseBookId);
        setBook(mongooseBookData as Book);
        console.log(mongooseBookData);
        
  
        if (mongooseBookData) {
          const response = await mongooseClient.getClubsReadingPerBook(mongooseBookData._id);
          setClubsReading(response);
            
          try {
            const userSession = await mongooseClient.profile();
            setCurrentUser(userSession);
    
            if (userSession && userSession._id) {
               console.log(userSession);
              if (userSession.booksRead) {
                  setBookInBooksRead(userSession.booksRead.includes(mongooseBookData._id));
              }
      
              if (userSession.wishlist) {
                  setBookInWishlist(userSession.wishlist.includes(mongooseBookData._id));
              }
    
              const clubs = await mongooseClient.getUserClubsWithoutBookRec(userSession._id, mongooseBookData._id);
              console.log("clubs without recs");
              console.log(clubs);
              setUserClubsWithoutRecs(clubs);
          }
          }
          catch (e) {

          }

        }
      }
      else {
        navigate("/book");
      }

    };

  const recommendBookToClub = async (clubId : string) => {
      if (currentUser && currentUser._id) {
          await mongooseClient.recommendBookToClub(clubId, book._id);
          setUserClubsWithoutRecs(userClubsWithoutRecs.filter(club=>club._id !== clubId));
      }
      else {
        navigate('/login');
      }
  }

  const toggleBookInWishlist = async () => {
      if (currentUser && currentUser._id) {
          if (bookInWishlist) {
              const updatedUser = await mongooseClient.removeFromWishlist(currentUser._id, book._id);
              setCurrentUser(updatedUser);
              setBookInWishlist(false);
          }
          else {  
              const updatedUser = await mongooseClient.addToWishlist(currentUser._id, book._id);
              setCurrentUser(updatedUser);
              setBookInWishlist(true);
          }   
          
        
      }
      else {
        navigate('/login');
      }
  }

  const toggleBookInBooksRead = async () => {
      if (currentUser && currentUser._id) {
          if (bookInBooksRead) {
              const updatedUser = await mongooseClient.removeFromBooksRead(currentUser._id, book._id);
              setCurrentUser(updatedUser);
              setBookInBooksRead(false);
          }
          else {  
              const updatedUser = await mongooseClient.addToBooksRead(currentUser._id, book._id);
              setCurrentUser(updatedUser);
              setBookInBooksRead(true);
          }   
      }
      else {
        navigate('/login');
      }
  }

    useEffect(() => {
      if (bookId) {
        findBook(bookId);
      }
    }, []);

    return (
        <div>
            
            { book 
            ? 
            <>
            <Header/>
            <MongooseBook book={book} 
            currentUser={currentUser}
            clubsReading={clubsReading}
            bookInBooksRead={bookInBooksRead}
            bookInWishlist={bookInWishlist}
            userClubsWithoutRecs={userClubsWithoutRecs}
            recommendBookToClub={recommendBookToClub}
            toggleBookInBooksRead={toggleBookInBooksRead}
            toggleBookInWishlist={toggleBookInWishlist}
            />
            </>
            : 
            <NoBookFound/>
            }
        </div>

    );
}
