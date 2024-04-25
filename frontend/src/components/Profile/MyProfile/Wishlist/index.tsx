import { Club, Book } from "../../../types";
import MongooseBookSearch from "../../../MongooseSearchBooks";
import GoogleBooksSearch from "../../../SearchBooks/search";
import '../../index.css';

export default function Wishlist(
    { books, addToWishlist }
        :
        { books: Book[], addToWishlist: (book: Book) => void }) {
            const renderBooks = (books : Book[]) => {
                return (
                    <div className="col-lg book-container d-flex flex-wrap">
                      {books.map((book: Book, index) => {
                        if (book) {
                          return (
                            <div key={index} className="book"> 
                              <button onClick={() => {addToWishlist(book)}} className="book-wishlist">
                                <div>
                                  {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                                  <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                                  : <img src={require("../../../../images/emptyBook.jpeg")} alt={book.title} />}
                                </div>
                                  <h5 className="book-title">{book.title}</h5>
                                  <p className="book-author">{book.author}</p>
                              </button>
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
        <div>
            <h6>{books.length} Books</h6>
            <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />
            <MongooseBookSearch books={books} renderBooks={renderBooks}/>
        </div>
    )
}