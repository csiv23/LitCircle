import { Club, Book } from "../../types";
import SearchableBooksList from "../BooksList";

export default function BooksRead({books, club} : {books : Book[], club : Club}) {
return (
    <div className="d-flex flex-wrap">
    <div>
    {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.imageUrl} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
    </div>
    <h4>
        Books We've Read
    </h4>
    <br></br>
    <h4>{books.length} Books</h4>
    {/* <SearchableBooksList booksList={books} /> */}
    </div>
    )
}