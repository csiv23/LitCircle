import GoogleBooksSearch from "./search";
import { Routes, Route, Navigate } from "react-router";
import { Link } from "react-router-dom";
import { Book } from "../types";
import Header from "../Header";
import './index.css';

export default function GoogleAPI() {

  const renderBooks = (books : Book[]) => {
    return (
      <div className="row">
        <div className="col-lg book-container d-flex flex-wrap">
          {books.map((book: Book, index) => {
            if (book) {
              return (
                <div key={index} className="book book-item">
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
                            <div key={index}>
                                <p>Book with ID not found.</p>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );}

    return (
      <div>
          <Header/>
          <div className="search-font club-bg">
            <div className="club-container">
              <Routes>
                <Route path="/" element={<GoogleBooksSearch renderBooks={renderBooks} searchPath={true}/>} />
                <Route path="/:title" element={<GoogleBooksSearch renderBooks={renderBooks} searchPath={true}/>} />
              </Routes>
            </div>
          </div>
        </div>
      );
     
}
   