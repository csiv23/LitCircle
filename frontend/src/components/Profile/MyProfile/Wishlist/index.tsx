import { Book } from "../../../types";
import MongooseBookSearch from "../../../MongooseSearchBooks";
import GoogleBooksSearch from "../../../SearchBooks/search";

export default function Wishlist(
    { books, addToWishlist, removeFromWishlist }
        :
        { books: Book[], addToWishlist: (book: Book) => void, removeFromWishlist: (bookId: string) => void }) {
    const renderBooks = (books: Book[]) => {
        return (
            <div className="table-responsive">
                <table className="table">
                    <tbody>
                        <tr>
                            {books.map((book) => (
                                <td className="book" key={book._id}>
                                    <button onClick={() => removeFromWishlist(book._id)}>Remove Book</button>
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
            <br></br>
            <h4>{books.length} Books</h4>
            <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />
            <MongooseBookSearch books={books} renderBooks={renderBooks}/>
        </div>
    )
}