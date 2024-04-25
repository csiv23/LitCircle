import { Book, Club, ObjectId, User } from "../../types";
import * as mongooseClient from "../../../mongooseClient"
import { Link } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";
import MongooseBookSearch from "../../MongooseSearchBooks";
import '../index.css';


function SearchableBooksList(
{ 
    booksList,
    removeBook,
    isAdmin = true,
} : 
{ 
    booksList: Book[],
    removeBook : (bookId : string) => void,
    isAdmin : boolean
}) 
{   
    const renderBook = (book : Book) => {
        return (
            <div key={book._id} className="book book-item">
            <Link to={`/book/${book.googleBooksId}`}>
                <div>
                {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                     <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                    : <img src={require("../../../images/emptyBook.jpeg")} alt={book.title} />}
                </div>
                <h5 className="book-title">{book.title}</h5>
                <p className="book-author">{book.author}</p>
            </Link>
            {isAdmin && <button onClick={() => {removeBook(book._id)}} className="btn">
                Remove Book
            </button>}
        </div>
        );
    }

    const renderBooks = (books : Book[]) => {
        return (
            <div className="books-list-container">
                {books && books.map(renderBook)}
            </div>)
    }

    return (
        <MongooseBookSearch books={booksList} renderBooks={renderBooks}/>
    )
}

export default SearchableBooksList;

