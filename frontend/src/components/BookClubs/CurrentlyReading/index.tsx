import { Link } from "react-router-dom";
import { Book, Club } from "../../types";
import '../index.css';

export default function CurrentlyReading(
    {currentBook, club} 
    : 
    {currentBook : Book, club : Club}) {
    return (
        <div>
            <div className="col-md-11 club-container">
                <h4>Currently Reading</h4>
            </div>
            <div className="d-flex flex-wrap">
        <div key={currentBook._id} className="col-md-11 club-container book">
            <Link to={`/book/${currentBook.googleBooksId}`} className="d-flex align-items-center">
                <div>
                    {(currentBook.coverImageUrl && currentBook.coverImageUrl !== "") ? 
                    <img src={currentBook.coverImageUrl} alt={currentBook.title} className="book-cover" /> 
                    : <img src={require("../../../images/emptyBook.jpeg")} alt={currentBook.title} />}
                </div>
                <div className="book-details">
                    <h5 className="book-title">{currentBook.title}</h5>
                    <p className="book-author">{currentBook.author}</p>
                    <p className="book-description">{currentBook.description}</p>
                </div>
            </Link>
        </div>
    </div>
        </div>
    );
}