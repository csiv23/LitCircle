import * as mongooseClient from "../../mongooseClient";
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BookclubResults from "./bookclubSearchResults";
import { User } from "../types";
import * as client from "../../mongooseClient";
import './index.css';

export default function BookclubSearch() {
  const navigate = useNavigate();
  const { name } = useParams();
  const [search, setSearch] = useState(name);
  const [results, setResults] = useState<any>();

  const fullTextSearch = async (text = "") => {
    if (text !== "") {
      const results = await mongooseClient.searchBookclubs(text);
      setResults(results);
    }
  };

  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    fullTextSearch(name);
    const fetchProfile = async () => {
      try {
        const userSession = await client.profile();
        setCurrentUser(userSession);
      } catch (error) {
        navigate("/login");
      }
    }
    fetchProfile();
  }, []);

  console.log("BookclubSearch currentUser: " + JSON.stringify(currentUser));

  return (
    <div>
      <div className="club-container">
        <h2>Search Bookclubs</h2>
        <input type="text" value={search}
          onChange={(e) =>
            setSearch(e.target.value)} />
        <Link to={`/search-clubs/${search}`}>
          <button className="btn"
            onClick={() => fullTextSearch(search)}>
            Search
          </button>
        </Link>
        {results &&
          results.length > 0 && (
            <>
              <h3>Bookclubs</h3>
              <BookclubResults
                clubs={results} />
            </>
          )}
      </div>
    </div>
  )
}
