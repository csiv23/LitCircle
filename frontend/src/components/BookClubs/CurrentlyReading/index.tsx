import { Link } from "react-router-dom";
import { Book, Club } from "../../types";
import GoogleBooksSearch from "../../SearchBooks/ search";

export default function CurrentlyReading(
    {currentBook, club, isAdmin, setCurrentBook, markAsRead} 
    : 
    {currentBook : Book, club : Club, isAdmin : boolean, 
        setCurrentBook : (book:Book) => void,
        markAsRead : ()=>void;
    }) {
    
    const renderBooks = (books : Book[]) => {
        return (
            <div className="table-responsive">
            <table className="table">
                <tbody>
                <tr>
                {books.map((book) => (
                <td className="book" key={book._id}>
                    <button onClick={() => {setCurrentBook(book)}}>
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
        <div>
            <div className="col-md-11 club-container">
                {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.name} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
            </div>
            <div className="col-md-11 club-container">
                <h4>Currently Reading</h4>
            </div>
            {isAdmin && <div>
                <h4>Change Book</h4>
                <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />

            </div>}
            <div className="d-flex flex-wrap">    
        <div key={currentBook._id} className="book">
            <Link to={`/book/${currentBook.googleBooksId}`}>
                <div>
                {(currentBook.coverImageUrl && currentBook.coverImageUrl !== "") ? 
                     <img src={currentBook.coverImageUrl} alt={currentBook.title} className="book-cover" /> 
                    : <img src={require("../../../images/emptyBook.jpeg")} alt={currentBook.title} />}
                </div>
                <h5 className="book-title">{currentBook.title}</h5>
                <p className="book-author">{currentBook.author}</p>
                <p className="book-author">{currentBook.description}</p>
            </Link>
            {isAdmin && <button onClick={markAsRead}>
                    Archive Book
            </button>}
        </div>
    </div>
        </div>
    );
}