import { Book, ObjectId } from "../types";
import * as mongooseClient from "../../mongooseClient"
import { Link } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";

function BooksList(
{ books } : 
{ books: Book[] }
) {

    return (<div className="col-lg book-container d-flex flex-wrap">
    {books.map((book: Book) => {
        if (book) {
            return (
                <div key={book._id} className="book">
                    <Link to={`/book/${book.googleBooksId}`}>
                        <div>
                        {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                        <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                        : <img src={require("../../images/emptyBook.jpeg")} alt={book.title} />}
                        </div>
                        <h5 className="book-title">{book.title}</h5>
                        <p className="book-author">{book.author}</p>
                    </Link>
                </div>
            );
        } else {
            return (
                <div key={book}>
                    <p>Book with ID {book} not found.</p>
                </div>
            );
        }
    })}
</div>)
}

export default BooksList;