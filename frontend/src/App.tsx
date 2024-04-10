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
import Search from './components/Search';

function App() {
  const [books, setBooks] = useState<any>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookclubs, setBookclubs] = useState<any[]>([]);

  return (

    <div>
          <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="profile"/>} />
          <Route path="profile" element={<Profile firstName="John" lastName="Doe" />} />
          <Route path="bookclub" element={<BookClub />} />
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