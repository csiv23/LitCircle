import { Club, Book } from "../../types";
import SearchableBooksList from "../BooksList";
import GoogleBooksSearch from "../../SearchBooks/ search";
import '../index.css';

export default function Wishlist(
    {books, club, addToWishlist}
    : 
    {books : Book[], club : Club, addToWishlist : (book : Book) => void}) {
    const renderBooks = (books : Book[]) => {
        return (
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                {books.map((book) => (
               <td className="book" key={book._id}>
                    <button onClick={() => {addToWishlist(book)}}>
                           {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                            <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                           : <img src={require("../../../images/emptyBook.jpeg")} 
                           alt={book.title} className="book-cover"/>}
                       <h3>{book.title}</h3>
                       <p> by {book.author} </p>
                    </button>
               </td>
               ))}
                </tr>
              </tbody>
            </table>
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
          <SearchableBooksList booksList={books} />
        </div>
      </div>
    </div>
    )
}