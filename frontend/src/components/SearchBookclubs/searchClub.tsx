import * as mongooseClient from "../../mongooseClient";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BookclubResults from "./bookclubSearchResults";


export default function BookclubSearch() {
 const { name } = useParams();
 const [search, setSearch] = useState(name);
 const [results, setResults] = useState<any>();

 const fullTextSearch = async (text="") => {
   if (text !== "") {
    const results = await mongooseClient.searchBookclubs(text);
    setResults(results);

   }
 };

 useEffect(() => {
    fullTextSearch(name);
 }, []);

 return (
    <div>
      <h2>Search Bookclubs</h2>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      <Link to={`/search-clubs/${search}`}>
      <button
        onClick={() => fullTextSearch(search)}>
        Search
      </button>
      </Link>
      {results &&
        results.length > 0 && (
      <>
        <h2>Books</h2>
        <BookclubResults
          clubs={results} />
      </>
    )}
   </div>

)}
