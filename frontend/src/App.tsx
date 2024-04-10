import React, { useState } from 'react';
import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import './App.css';
import MyProfile from './components/MyProfile';
import PublicProfile from './components/PublicProfile';
import BookClub from './components/BookClub';
import Header from './components/Header';
import Books from './components/Books';
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from './database';
import { User, ObjectId } from './components/types';

function App() {
  const [books, setBooks] = useState<any>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookclubs, setBookclubs] = useState<any[]>([]);

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="profile"/>} />
          <Route path="profile/:userId" element={<MyProfile />} />
          <Route path="public-profile/:userId" element={<PublicProfile />} />
          <Route path="bookclub/:clubId" element={<BookClub bookclubs={bookclubs}/>} />
          {/* <Route path="book" element={<Books book={bookData} />} /> */}
          <Route path="header" element={<Header />}/>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
