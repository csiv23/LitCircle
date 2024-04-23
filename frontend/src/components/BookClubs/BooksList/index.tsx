import { Book, Club, ObjectId, User } from "../../types";
import * as mongooseClient from "../../../mongooseClient"
import { Link } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";
import MongooseBookSearch from "../../MongooseSearchBooks";


function SearchableBooksList(
{ 
    booksList,
    club
} : 
{ 
    booksList: Book[],
    club : Club
}) 
{   
    const renderBook = (book : Book) => {
        return (
            <div key={book._id} className="book">
            <Link to={`/book/${book.googleBooksId}`}>
                <div>
                {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                     <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                    : <img src={require("../../../images/emptyBook.jpeg")} alt={book.title} />}
                </div>
                <h5 className="book-title">{book.title}</h5>
                <p className="book-author">{book.author}</p>
            </Link>
        </div>
        );
    }

    const renderBooks = (books : Book[]) => {
        return (
            <div>
                {books && books.map(renderBook)}
            </div>)
    }

    return (
    <div className="d-flex flex-wrap">
    <div>
    {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.imageUrl} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
    </div>
    <div>
        <h4>Books We've Read</h4>
        <MongooseBookSearch books={booksList} renderBooks={renderBooks}/>
    </div>

    
    </div>
    )
}

export default SearchableBooksList;
