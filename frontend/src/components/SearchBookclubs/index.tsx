import { Routes, Route, } from "react-router";
import BookclubSearch from "./searchClub";
export default function SearchBookclubs() {

    return (
        <div className="container-fluid">
          <h1>Search Bookclubs</h1>
          <Routes>
       <Route path="/" element={<BookclubSearch />} />
       <Route path="/:name" element={<BookclubSearch />} />
        </Routes>
        </div>
      );
     
}