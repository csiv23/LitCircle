import { Book } from "../../../types";
import MongooseBookSearch from "../../../MongooseSearchBooks";
import GoogleBooksSearch from "../../../SearchBooks/search";
import { Link } from "react-router-dom";

export default function Wishlist(
    { books }
        :
        { books: Book[] }) {
    const renderBooks = (books: Book[]) => {
        return (
            <div className="table-responsive">
                <table className="table">
                    <tbody>
                        <tr>
                            {books.map((book) => (
                                <td className="book" key={book._id}>
                                    <Link to={`/book/${book.googleBooksId}`}>
                                        <div>
                                            {(book.coverImageUrl && book.coverImageUrl !== "") ?
                                                <img src={book.coverImageUrl} alt={book.title} className="book-cover" />
                                                : <img src={require("../../../../images/emptyBook.jpeg")} alt={book.title} />}
                                        </div>
                                        <h5 className="book-title">{book.title}</h5>
                                        <p className="book-author">{book.author}</p>
                                    </Link>
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
            <MongooseBookSearch books={books} renderBooks={renderBooks}/>
        </div>
    )
}