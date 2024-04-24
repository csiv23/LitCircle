import { Club, Book } from "../../types";
import SearchableBooksList from "../BooksList";

export default function BooksRead({books, club} : {books : Book[], club : Club}) {
return (
    <div className="d-flex flex-wrap">
        <div className="col-md-11 club-container">
            <h4>Books We've Read</h4>
            <h6>{books.length} Books</h6>
        </div>
        <div className="col-md-11 club-container">
            <SearchableBooksList booksList={books} />
        </div>
    </div>
    )
}