import * as client from "../../client";
import React, { useState, useEffect } from "react";
import GoogleBooks from "./books";
import { useParams, Link } from "react-router-dom";


export default function GoogleBooksSearch() {
 const { title } = useParams();
 const [search, setSearch] = useState(title);
 const [results, setResults] = useState<any>();

 const fullTextSearch = async (text="") => {
   if (text !== "") {
    const results = await client.searchBooks(text);
    setResults(results);
   }
 };

 useEffect(() => {
    fullTextSearch(title);
 }, []);

 return (
    <div>
      <h2>Search</h2>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      <Link to={`/search/${search}`}>
      <button
        onClick={() => fullTextSearch(search)}>
        Search
      </button>
      </Link>
      {results &&
        results.items &&
        results.items.length > 0 && (
      <>
        <h2>Books</h2>
        <GoogleBooks
          books={results.items} />
      </>
    )}
   </div>

)}
