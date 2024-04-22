import { Routes, Route, useNavigate, } from "react-router";
import BookclubSearch from "./searchClub";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { User } from "../types";
import * as client from "../../mongooseClient";

export default function SearchBookclubs() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    const fetchProfile = async () => {
      const userSession = await client.profile();
      setCurrentUser(userSession);
    }
    fetchProfile();
  }, [])
  console.log("SearchBookClubs currentUser: " + JSON.stringify(currentUser));

  if (!currentUser) {
    navigate("/login");
  }

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