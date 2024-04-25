import { Club, Book } from "../../../types";
import SearchableBooksList from "../../../BookClubs/BooksList";
import GoogleBooksSearch from "../../../SearchBooks/search";

export default function Wishlist(
    { books, addToWishlist }
        :
        { books: Book[], addToWishlist: (book: Book) => void }) {
    const renderBooks = (books: Book[]) => {
        return (
            <div className="table-responsive">
                <table className="table">
                    <tbody>
                        <tr>
                            {books.map((book) => (
                                <td className="book" key={book._id}>
                                    <button onClick={() => { addToWishlist(book) }}>
                                        {(book.coverImageUrl && book.coverImageUrl !== "") ?
                                            <img src={book.coverImageUrl} alt={book.title} className="book-cover" />
                                            : <img src={require("../../../../images/emptyBook.jpeg")}
                                                alt={book.title} className="book-cover" />}
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
            {/* <div>
                {(club.imageUrl && club.imageUrl !== "") ?
                    <img src={club.imageUrl} alt={club.imageUrl} className="book-cover" />
                    : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
            </div> */}
            {/* <h4>
                Books We Want to Read
            </h4> */}
            <br></br>
            <h4>{books.length} Books</h4>

            <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />
            <SearchableBooksList booksList={books} />
        </div>
    )
}