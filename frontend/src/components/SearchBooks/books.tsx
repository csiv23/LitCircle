import * as client from "../../mongooseClient";
import { Link } from "react-router-dom";
import { Book } from "../types";
export default function GoogleBooks(
  { books }: { books: Book[] }) {

  return (
    <div className="row">
      <div className="col-lg book-container d-flex flex-wrap">
        {books.map((book: Book, index) => {
          if (book) {
            return (
              <div key={index} className="book book-item">
                <Link to={`/book/${book._id}`}>
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