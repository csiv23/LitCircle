import { Link, useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { User, Book, Club, ObjectId } from "../../types";
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from '../../../database';
import Header from "../../Header";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../../mongooseClient";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { setCurrentUser } from "../../../reducers/usersReducer";
import Wishlist from "./Wishlist";

function getURL( book: Book  ) {
    return `/book/${book.title.replace(/\s+/g, '-').toLowerCase()}`
}

function MyProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userId } = useParams();
    const [currentUser, setCurrentUser] = useState<User>();
    const [currentUserClubs, setCurrentUserClubs] = useState<Club[]>([]);
    const [currentUserBooksRead, setCurrentUserBooksRead] = useState<Book[]>([]);
    const [currentUserBooksWishlist, setCurrentUserBooksWishlist] = useState<Book[]>([]);
    useEffect(() => {
        fetchProfile();
    }, []);
    
    useEffect(() => {
        if (currentUser) {
            fetchUsersClubs();
            fetchUsersBooksRead();
            fetchUsersBooksWishlist();
            console.log("Rerendered the 2nd useEffect")
        }
    }, [currentUser]);

    const fetchProfile = async () => {
        try {
            const userSession = await client.profile();
            setCurrentUser(userSession);
        } catch (error) {
            navigate("/login");
        }
    }
    const fetchUsersClubs = async () => {
        const allClubs = await client.getClubs();
        const userBookClubIds: ObjectId[] = [];
        currentUser?.bookClubs.map((bookClub: any) => userBookClubIds.push(bookClub["_id"]));
        const commonClubs = allClubs.filter((club: Club) => userBookClubIds.includes(club["_id"]));
        setCurrentUserClubs(commonClubs);
    };
    const fetchUsersBooksRead = async () => {
        const allBooks = await client.getBooks();
        const userBooksIds: ObjectId[] = [];
        currentUser?.booksRead.map((bookId: ObjectId) => userBooksIds.push(bookId));
        const commonBooks = allBooks.filter((book: Book) => userBooksIds.includes(book["_id"]));
        setCurrentUserBooksRead(commonBooks);
    };
    const fetchUsersBooksWishlist = async () => {
        const allBooks = await client.getBooks();
        const userBooksIds: ObjectId[] = [];
        currentUser?.wishlist.map((bookId: ObjectId) => userBooksIds.push(bookId));
        const commonBooks = allBooks.filter((book: Book) => userBooksIds.includes(book["_id"]));
        setCurrentUserBooksWishlist(commonBooks);
    };
    const signout = async () => {
        console.log("currentUser before signout: " + JSON.stringify(currentUser));
        await client.signout();
        navigate("/login");
    };
    const addToWishlist = async (book: Book) => {
        if (currentUser) {
            console.log("addToWishlist")
            try {
                const mongooseBookId = await client.createBook(book);
                const updatedUser = await client.addToWishlist(currentUser._id, mongooseBookId);
                setCurrentUser(updatedUser);
            } catch {
                console.log("addToWishlist catch statement");
                const gotBook = await client.getBookById(book._id);
                const updatedUser = await client.addToWishlist(currentUser._id, gotBook._id);
                console.log("addToWishlist updatedUser: " + JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }
        }
    }
    const addToBooksRead = async (book: Book) => {
        if (currentUser) {
            console.log("addToBooksRead")
            try {
                const mongooseBookId = await client.createBook(book);
                const updatedUser = await client.addToWishlist(currentUser._id, mongooseBookId);
                setCurrentUser(updatedUser);
            } catch {
                console.log("addToBooksRead catch statement");
                const gotBook = await client.getBookById(book._id);
                const updatedUser = await client.addToBooksRead(currentUser._id, gotBook._id);
                console.log("addToBooksRead updatedUser: " + JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }
        }
    }
    const addToMyClubs = async (club: Club) => {
        if (currentUser) {
            console.log("addToMyClubs");
            
        }
    }
    const removeFromWishlist = async (bookId: string) => {
        // const filteredWishlist = currentUserBooksWishlist.filter(book => book._id !== bookToRemove._id);
        if (currentUser) {
            try {
                console.log("removeFromWishlist clicked")
                await client.removeFromWishlist(currentUser._id, bookId);
                // const filteredWishlist = currentUserBooksWishlist.filter(book => book._id !== bookId);
                // setCurrentUserBooksWishlist(filteredWishlist);
                // fetchUsersBooksWishlist();
                // setCurrentUser(updatedUser);
                console.log("Successfully removed book from wishlist")
            } catch (error) {
                console.error("Error removing from wishlist:", error);
            }
        }
    }

    console.log("MyProfile currentUser: " + JSON.stringify(currentUser));
    if (!currentUser || currentUser?._id !== userId) {
        // Display the public profile
        navigate(`/profile/${userId}`);
    }

    return (
        <div>
            <Header />
            <div className="row">
                <div className="col-md-3">
                    <h2>Profile</h2>
                    <br />
                    <div className="profile-avatar">
                        <img src={require(`../../images/avatar.jpeg`)} alt="Avatar" />
                    </div>
                    <div className="profile-name">
                        <h3>
                            {currentUser?.firstName} {currentUser?.lastName}
                            <Link to={`/myProfile/${userId}/Edit`}>
                                <button className="btn btn-secondary ml-2">Edit</button>
                            </Link>
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">Username:</span> {currentUser?.username}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">Followers:</span> {currentUser?.followers.length}
                        </div>
                        <div className="col-sm-6">
                            <span className="mr-2">Following:</span> {currentUser?.following.length}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">Email:</span> {currentUser?.email}
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="row align-items-center">
                        <div className="col-md-8 bookclub-section-title">
                            <h4>My BookClubs</h4>
                        </div>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary">Add BookClub</button>
                        </div>

                        <div className="d-flex flex-wrap bookclub-pfp">
                            {currentUserClubs?.map((club: Club, index) => {
                                if (club) {
                                    return (
                                        <div key={index}>
                                            <Link to={`/bookclub/${club._id}`}>
                                                <h5>{club.name}</h5>
                                                <img src={require(`../../../images/BookclubDefault.jpeg`)} alt={club.name} className="book-cover" />
                                            </Link>
                                            <p>Members: {club.members.length}</p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index}>
                                            <p>Club with ID not found.</p>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h4>Books I've Read</h4>
                        </div>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary">Add Book</button>
                        </div>
                        <Wishlist 
                            books={currentUserBooksWishlist}
                            addToWishlist={addToBooksRead}/>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary" onClick={() => addToBooksRead({
                                _id: '66285721ae48634f3257c933',
                                title: 'e',
                                googleBooksId: 'NKFPEAAAQBAJ',
                                author: 'Matt Beaumont',
                                description: 'A Novel',
                                coverImageUrl: 'http://books.google.com/books/content?id=NKFPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
                                clubsReading: []
                            })}>Add Book</button>
                        </div>
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                            {currentUserBooksRead?.map((book: Book, index) => {
                                if (book) {
                                    return (
                                        <div key={index} className="book">
                                            <Link to={`/book/${book._id}`}>
                                                <img src={require(`../../../images/emptyBook.jpeg`)}
                                                    alt={book.title} />
                                                <h5>{book.title}</h5>
                                                <p>{book.author}</p>
                                            </Link>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index}>
                                            <p>Book with ID not found.</p>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h4>My Book Wishlist</h4>
                        </div>
                        <Wishlist 
                            books={currentUserBooksWishlist}
                            addToWishlist={addToWishlist}/>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary" onClick={() => addToWishlist({
                                _id: '66285721ae48634f3257c933',
                                title: 'e',
                                googleBooksId: 'NKFPEAAAQBAJ',
                                author: 'Matt Beaumont',
                                description: 'A Novel',
                                coverImageUrl: 'http://books.google.com/books/content?id=NKFPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
                                clubsReading: []
                            })}>Add Book</button>
                        </div>
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                            {currentUserBooksWishlist?.map((book: Book, index) => {
                                if (book) {
                                    return (
                                        <div>
                                            <button onClick={() => removeFromWishlist(book._id)}>Remove Book</button>
                                            <div key={index} className="book">
                                                <Link to={`/book/${book._id}`}>
                                                    <img src={require(`../../../images/emptyBook.jpeg`)}
                                                        alt={book.title} />
                                                    <h5>{book.title}</h5>
                                                    <p>{book.author}</p>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index}>
                                            <p>Book with ID not found.</p>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
                <button onClick={signout}>Logout</button>
            </div>
        </div>
    );
}
export default MyProfile;