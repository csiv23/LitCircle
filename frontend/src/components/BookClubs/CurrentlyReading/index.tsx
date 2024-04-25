// Import necessary hooks and types
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Book, Club } from "../../types";
import '../index.css';
import GoogleBooksSearch from "../../SearchBooks/search";
import * as mongooseClient from "../../../mongooseClient";

export default function CurrentlyReading(
    { currentBook, club, isAdmin, setCurrentBook, markAsRead }
    :
    {
        currentBook : Book, club : Club, isAdmin : boolean, 
        setCurrentBook : (book:Book) => void,
        markAsRead : ()=>void;
    }) {

    // Function to render a list of books
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

    // Function to fetch current book from the backend using Mongoose Client
    const fetchCurrentBook = async () => {
        try {
            if (club.currentBook !== "") { // Check if club's current book is not empty
                const response = await mongooseClient.mongooseGet(`clubs/${club._id}/currentBook`);
                setCurrentBook(response);
            }
        } catch (error) {
            console.error("Failed to fetch current book:", error);
        }
    };

    // Fetch current book when component mounts
    useEffect(() => {
        fetchCurrentBook();
    }, []); // Empty dependency array to fetch only once when component mounts

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
            {isAdmin && 
                <div>
                    <h4>Change Book</h4>
                    <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />
                </div>
            }
            <div className="d-flex flex-wrap">    
                {/* Display current book information */}
                {currentBook && currentBook.title !== "Untitled" && currentBook.author !== "N/A" && currentBook.description !== "N/A" && (
                    <div key={currentBook._id} className="col-md-11 club-container book">
                        <Link to={`/book/${currentBook.googleBooksId}`} className="d-flex align-items-center">
                            <div>
                                    {(currentBook.coverImageUrl && currentBook.coverImageUrl !== "") ? 
                                   <img src={currentBook.coverImageUrl} alt={currentBook.title} className="book-cover" /> 
                                    : <img src={require("../../../images/emptyBook.jpeg")} alt={currentBook.title} />}
                            </div>
                <div className="book-details">
                                <h5 className="book-curr-title">{currentBook.title}</h5>
                                <p className="book-curr-author">{currentBook.author}</p>
                                <p className="book-description">{currentBook.description}</p>
                </div>
                        </Link>
                        {isAdmin && 
                            <button onClick={markAsRead}>
                                Archive Book
                            </button>
                        }
                    </div>
                )}
                {(!currentBook || currentBook.title === "Untitled" || currentBook.author === "N/A" || currentBook.description === "N/A") && (
                    // Display message when no current book is being read
                    <p>No current book being read</p>
                )}
            </div>
        </div>
    );
}
