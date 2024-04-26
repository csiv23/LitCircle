import { Book } from "../../../types";
import MongooseBookSearch from "../../../MongooseSearchBooks";
import GoogleBooksSearch from "../../../SearchBooks/search";
import { Link } from "react-router-dom";

export default function BooksRead(
    { books }
        :
        { books: Book[] }) {
            const renderBooks = (books : Book[]) => {
                return (
                    <div className="col-lg book-container d-flex flex-wrap">
                      {books.map((book: Book, index) => {
                        if (book) {
                          return (
                            <div key={index} className="book"> 
                              <Link to={`/book/${book.googleBooksId}`}>
                                        <div>
                                            {(book.coverImageUrl && book.coverImageUrl !== "") ?
                                                <img src={book.coverImageUrl} alt={book.title} className="book-cover" />
                                                : <img src={require("../../../../images/emptyBook.jpeg")} alt={book.title} />}
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
                        );}
                      })}
                    </div>    
                );
    }

    return (
        <div className="d-flex flex-wrap">
            <MongooseBookSearch books={books} renderBooks={renderBooks}/>
        </div>
    )
}