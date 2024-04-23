import { Link } from "react-router-dom";
import { Book, Club } from "../../types";

export default function CurrentlyReading(
    {currentBook, club} 
    : 
    {currentBook : Book, club : Club}) {
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
        </div>
    </div>
        </div>
    );
}