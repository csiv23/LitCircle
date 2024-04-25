import { Routes, Route, useNavigate, } from "react-router";
import BookclubSearch from "./searchClub";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { User } from "../types";
import * as client from "../../mongooseClient";
import Header from "../Header";

export default function SearchBookclubs() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userSession = await client.profile();
        setCurrentUser(userSession);
      } catch (error) {
        navigate("/login");
      }
    }
    fetchProfile();
  }, [])
  console.log("SearchBookClubs currentUser: " + JSON.stringify(currentUser));

  // if (!currentUser) {
  //   navigate("/login");
  // }

  return (
    <div>
      <Header/>
      <div className="container-fluid search-font club-bg">
        <Routes>
          <Route path="/" element={<BookclubSearch />} />
          <Route path="/:name" element={<BookclubSearch />} />
        </Routes>
      </div>
    </div>
  );

}