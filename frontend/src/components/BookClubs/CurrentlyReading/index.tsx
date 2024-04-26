// Import necessary hooks and types
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book, Club, ObjectId, User } from "../../types";
import '../index.css';
import GoogleBooksSearch from "../../SearchBooks/search";
import * as mongooseClient from "../../../mongooseClient";

export default function CurrentlyReading() {
    const navigate = useNavigate();
    const {clubId} = useParams();
    const [club, setClub] = useState<Club>({
        _id: "",
        name: "",
        description: "",
        members: [],
        booksRead: [],
        wishlist: [],
        currentBook: "",
        nextMeeting: {
        meetingDate: new Date(),
        location: ""
        },
        organizer: "",
        imageUrl: ""
    });
    const [currentUser, setCurrentUser] = useState<User>(
        {
            _id: "",
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            followers: [],
            following: [],
            wishlist: [],
            booksRead: [],
            bookClubs: [],
            avatar: "",
        }
    );
    const [isAdmin, setIsAdmin] = useState(false);
    const [currBook, setCurrBook] = useState<Book>({  _id: "",
    googleBooksId: "",
    title: "Untitled",
    author: "N/A",
    coverImageUrl: "",
    description: "N/A",
    clubsReading: [],
    });
    const markAsRead = async () => {
        if (clubId && currBook && currBook._id) {
            const updatedClub = await mongooseClient.markCurrentBookAsRead(clubId);
            setCurrBook({
                _id: "",
                googleBooksId: "",
                title: "Untitled",
                author: "N/A",
                coverImageUrl: "",
                description: "N/A",
                clubsReading: [],
              });
            setClub(updatedClub);
        }
    }

    const setCurrentBook = async (book : Book) => {
        if (clubId) {
            const mongooseBookId = await mongooseClient.createBook(book);
            await mongooseClient.setCurrentBook(clubId, mongooseBookId);
            const newCurrentBook = await mongooseClient.getClubCurrentBook(clubId);
            console.log("new book " + newCurrentBook);
            setCurrBook(newCurrentBook);
            setClub({...club, currentBook: mongooseBookId});
        }
    }

    const setup = async (clubId : ObjectId) => {
        const userSession = await mongooseClient.profile();
        setCurrentUser(userSession);

        if (userSession) {
            const currentClub = await mongooseClient.getBookClubById(clubId);
            setClub(currentClub);
            console.log(currentClub);

            const userIsAdmin = currentClub.organizer === userSession._id
            setIsAdmin(userIsAdmin)
            console.log("user is admin: " + userIsAdmin);

            const currentBook = await mongooseClient.getClubCurrentBook(clubId);
            setCurrBook(currentBook);
        }
        else {
            navigate("/login");
        };
    }

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
                await setCurrentBook(response);
            }
        } catch (error) {
            console.error("Failed to fetch current book:", error);
        }
    };

    // Fetch current book when component mounts
    useEffect(() => {
        if (clubId) {
            setup(clubId);
        }
    }, [clubId]); 

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
                {currBook && (
                    <div key={currBook._id} className="col-md-11 club-container book">
                        <Link to={`/book/${currBook.googleBooksId}`} className="d-flex align-items-center">
                            <div>
                                    {(currBook.coverImageUrl && currBook.coverImageUrl !== "") ? 
                                   <img src={currBook.coverImageUrl} alt={currBook.title} className="book-cover" /> 
                                    : <img src={require("../../../images/emptyBook.jpeg")} alt={currBook.title} />}
                            </div>
                <div className="book-details">
                                <h5 className="book-curr-title">{currBook.title}</h5>
                                <p className="book-curr-author">{currBook.author}</p>
                                <p className="book-description">{currBook.description}</p>
                </div>
                        </Link>
                        {isAdmin && 
                            <button onClick={markAsRead}>
                                Archive Book
                            </button>
                        }
                    </div>
                )}
                {(!currBook || (currBook.title === "Untitled" && currBook.author === "N/A" && currBook.description === "N/A")) && (
                    // Display message when no current book is being read
                    <p>No current book being read</p>
                )}
            </div>
        </div>
    );
}
