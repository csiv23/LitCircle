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
import Login from './components/Login';
import EditProfile from './components/EditProfile';
import GoogleAPI from './components/SearchBooks';
import Home from './components/Home';

function App() {
  return (

    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="login" />} />
          <Route path='login' element={<Login />} />
          <Route path="profile" element={<PublicProfile />} />
          <Route path="myProfile/:userId" element={<MyProfile />} />
          <Route path="myProfile/:userId/Edit" element={<EditProfile />} />
          <Route path="bookclub" element={<BookClubs />} />
          <Route path="search/*" element={<GoogleAPI />} />
          <Route path="Book/:bookId" element={<Books />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
