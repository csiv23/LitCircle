import React, { useState } from 'react';
import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import './App.css';
import MyProfile from './components/MyProfile';
import PublicProfile from './components/PublicProfile';
import BookClubs from './components/BookClubs';
import Header from './components/Header';
import Books from './components/Books';
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from './database';
import { User, ObjectId } from './components/types';
import GoogleAPI from './components/SearchBooks';
import Home from './components/Home';

function App() {
  return (

    <div>
          <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Home"/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="profile" element={<PublicProfile/>} />
          <Route path="bookclub/:clubId" element={<BookClubs/>} />
          <Route path="/search-books/*" element={<GoogleAPI/>}/>
          <Route path="book/:bookId" element={<Books/>}/>
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
