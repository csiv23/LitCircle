import { Club, Book } from "../../types";
import SearchableBooksList from "../BooksList";
import GoogleBooksSearch from "../../SearchBooks/search";
import '../index.css';

export default function Wishlist(
    {books, club, addToWishlist, removeFromWishlist, isAdmin}
    : 
    {books : Book[], club : Club, isAdmin : boolean
      addToWishlist : (book : Book) => void,
      removeFromWishlist : (bookId : string) => Promise<void>}
  ) {
    const renderBooks = (books : Book[]) => {
        return (
          <div className="row">
            <div className="col-lg book-container d-flex flex-wrap">
              {books.map((book: Book, index) => {
                if (book) {
                  return (
                    <div key={index} className="book"> 
                      <button onClick={() => {addToWishlist(book)}} className="book-wishlist">
                        <div>
                          {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                          <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                          : <img src={require("../../../images/emptyBook.jpeg")} alt={book.title} />}
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
          </div>
        );
      }

return (
    <div className="d-flex flex-wrap">
      <div className="col-md-11 club-container">
        <h4>Books We Want to Read</h4>
        <h6>{books.length} Books</h6>
      </div>
      <div className="col-md-11 club-container">
        <div>
          <h5>Add Book</h5>
          <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />
        </div>
        <div> 
          <h5>Search Our Wishlist</h5>
          <SearchableBooksList booksList={books} removeBook={removeFromWishlist} isAdmin={isAdmin}  />
        </div>
      </div>
    </div>
    )
}