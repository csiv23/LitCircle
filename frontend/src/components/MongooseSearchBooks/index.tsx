import { useEffect, useState } from "react";
import { Book } from "../types";
import '../../index.css'

export default function MongooseBookSearch(
    {
        books,
        renderBooks,
    } :
    {
        books: Book[],
        renderBooks: (books : Book[]) => JSX.Element
    }
) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([] as Book[]);
    const [booksList, setBooksList] = useState(books);

    const searchBooks = (bookQuery : string) : Book[] => {
        if (books && books.length > 0) {
            return books.filter((book : Book) => {
                return book.title.toLowerCase().startsWith(bookQuery.toLowerCase());
            })
        }

        return books;
    }

    const fullTextSearch = async (text="") => {
        if (text !== "") {
         const results = searchBooks(text);
         setResults(results);
         console.log(results);
        }
        else {
            setResults(books);
        }
    };
    

    useEffect(() => {
        console.log("rerender");
        console.log(booksList);
        fullTextSearch(search);
     }, [results, booksList, search]);
    
     return (
    <div>
      <label htmlFor="searchInput">
        <input type="text" 
          className="search-bar"
          id="searchInput"
          placeholder="Search for books"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)} /></label>
      <button className="btn"
        onClick={() => fullTextSearch(search)}>
        Search
      </button>
      <div>
      {(results &&
        results.length > 0) ? renderBooks(results)  : renderBooks(books)}
      </div>

    </div>
    )
}