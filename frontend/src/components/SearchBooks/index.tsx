import GoogleBooksSearch from "./ search";
import { Routes, Route, Navigate } from "react-router";

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
   
   