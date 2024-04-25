import * as client from "./client";
import React, { useState, useEffect } from "react";
import GoogleBooks from "./books";
import { useParams, Link } from "react-router-dom";
import { Book } from "../types";
import './index.css';

export default function GoogleBooksSearch(
  {renderBooks, searchPath}
:
  {renderBooks : (books : Book[]) => JSX.Element, searchPath:boolean}) {
 const { title } = useParams();
 const [search, setSearch] = useState(title);
 const [results, setResults] = useState([] as Book[]);

 const fullTextSearch = async (text="") => {
   if (text !== "") {
    const results = await client.searchBooks(text);
    console.log(results)
    setResults(results);
   }
 };

 useEffect(() => {
    fullTextSearch(title);
 }, []);

 return (
    <div>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      {
        searchPath 
        ? (<Link to={`/search-books/${search}`}>
        <button className="btn"
          onClick={() => fullTextSearch(search)}>
          Search
        </button>
        </Link>)
        : (
          <button className="btn"
          onClick={() => fullTextSearch(search)}>
          Search
        </button>
        )
      }
      <div>
        {results &&
          results.length > 0 && renderBooks(results)}
      </div>
   </div>

)}
