import React, { useState } from 'react';
import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import './App.css';
import MyProfile from './components/Profile/MyProfile';
import PublicProfile from './components/Profile/PublicProfile';
import BookClubs from './components/BookClubs';
import Header from './components/Header';
import Books from './components/Books';
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from './database';
import { User, ObjectId } from './components/types';
import Login from './components/Login';
import EditProfile from './components/Profile/MyProfile/EditProfile';
import GoogleAPI from './components/SearchBooks';
import Home from './components/Home';
import SearchBookclubs from './components/SearchBookclubs';
import CreateBookClub from './components/CreateBookClub';
import NoBookFound from './components/Books/NoBookFound';

/**
 * The main component of the application.
 *
 * @returns The JSX element representing the application.
 */
function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path="profile/:userId" element={<PublicProfile />} />
          <Route path="myProfile/:userId" element={<MyProfile />} />
          <Route path="myProfile/:userId/Edit" element={<EditProfile />} />
          <Route path="bookclub/:clubId/*" element={<BookClubs />} />
          <Route path="search-books/*" element={<GoogleAPI />} />
          <Route path="search-clubs/*" element={<SearchBookclubs />} />
          <Route path="book/:bookId" element={<Books />} />
          <Route path="book" element={<NoBookFound />} />
          <Route path="create-club" element={<CreateBookClub />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
