import React, { useState } from 'react';
import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import './App.css';
import MyProfile from './components/MyProfile';
import PublicProfile from './components/PublicProfile';
import BookClub from './components/BookClub';
import Header from './components/Header';
import Books from './components/Books';
import Book from './components/Book';
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from './database';
import { User, ObjectId } from './components/types';
import Search from './components/Search';
import Login from './components/Login';

function App() {
  const [books, setBooks] = useState<any>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookclubs, setBookclubs] = useState<any[]>([]);

  return (

    <div>
          <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="login"/>} />
          <Route path='login' element={<Login />}/>
          <Route path="profile" element={<PublicProfile/>} />
          <Route path="bookclub" element={<BookClub bookclubs={bookclubs} />} />
          <Route path="search/*" element={<Search/>}/>
          <Route path="Book/:bookId" element={<Book/>}/>
        </Routes>
      </div>
    </HashRouter>
      {/* <Search/> */}
      {/* <Book 
                title={bookData.title}
                author={bookData.author}
                coverImageUrl={bookData.coverImageUrl}
                description={bookData.description}
                reviews={bookData.reviews}
                purchaseLinks={bookData.purchaseLinks}
                currentClubs={bookData.currentClubs}
        /> */}
    </div>
  );
}

export default App;
