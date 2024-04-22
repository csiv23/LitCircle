import { Routes, Route, useNavigate, } from "react-router";
import BookclubSearch from "./searchClub";
import { useSelector } from "react-redux";
import { useEffect } from "react";
export default function SearchBookclubs() {
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.users.currentUser);
  console.log("SearchBookClubs currentUser: " + currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [])

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