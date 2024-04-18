import GoogleBooksSearch from "./ search";
import { Routes, Route, Navigate } from "react-router";
import * as client from "./client";

export default function GoogleAPI() {

    return (
        <div className="container-fluid">
          <h1>Search Books</h1>
          <Routes>
       <Route path="/" element={<GoogleBooksSearch />} />
       <Route path="/:title" element={<GoogleBooksSearch />} />
        </Routes>
        </div>
      );
     
}
   
   