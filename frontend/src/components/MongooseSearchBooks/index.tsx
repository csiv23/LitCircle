import { useEffect, useState } from "react";
import { Book } from "../types";

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
    const [results, setResults] = useState(books);

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
        fullTextSearch(search);
     }, []);
    
     return (
    <div>
        <div>
            <p>{books.length} Books</p>
        </div>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      <button
        onClick={() => fullTextSearch(search)}>
        Search
      </button>
      <div>
      {results &&
        results.length > 0 && renderBooks(results) }
      </div>

    </div>
    )
}