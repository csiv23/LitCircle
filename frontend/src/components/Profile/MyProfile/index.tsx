import { Link, useNavigate, useParams } from "react-router-dom";
import "../index.css";
import { User, Book, Club, ObjectId } from "../../types";
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from '../../../database';
import Header from "../../Header";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../../mongooseClient";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { setCurrentUser } from "../../../reducers/usersReducer";
import Wishlist from "./Wishlist";
import BooksRead from "./BooksRead";

function getURL( book: Book  ) {
    return `/book/${book.title.replace(/\s+/g, '-').toLowerCase()}`
}

function MyProfile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [currentUser, setCurrentUser] = useState<User>();
    const [currentUserClubs, setCurrentUserClubs] = useState<Club[]>([]);
    const [currentUserBooksRead, setCurrentUserBooksRead] = useState<Book[]>([]);
    const [currentUserBooksWishlist, setCurrentUserBooksWishlist] = useState<Book[]>([]);
    const [currentUserFollowers, setCurrentUserFollowers] = useState<User[]>();
    useEffect(() => {
        fetchProfile();
    }, []);
    
    useEffect(() => {
        if (currentUser) {
            fetchUsersClubs();
            fetchUsersBooksRead();
            fetchUsersBooksWishlist();
            fetchUsersFollowers();
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
        currentUser?.bookClubs.map((bookClub: any) => userBookClubIds.push(bookClub.ClubId));
        const commonClubs = allClubs.filter((club: Club) => userBookClubIds.includes(club._id));
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
    const fetchUsersFollowers = async () => {
        const allUsers = await client.getUsers();
        const followers = allUsers.filter((user: User) => currentUser?.followers.includes(user._id));
        setCurrentUserFollowers(followers);
    }
    const signout = async () => {
        await client.signout();
        navigate("/login");
    };
    const addToWishlist = async (book: Book) => {
        if (currentUser) {
            try {
                const mongooseBookId = await client.createBook(book);
                const updatedUser = await client.addToWishlist(currentUser._id, mongooseBookId);
                setCurrentUser(updatedUser);
            } catch {
                const updatedUser = await client.addToWishlist(currentUser._id, book._id);
                setCurrentUser(updatedUser);
            }
        }
    }
    const addToBooksRead = async (book: Book) => {
        if (currentUser) {
            try {
                const mongooseBookId = await client.createBook(book);
                const updatedUser = await client.addToBooksRead(currentUser._id, mongooseBookId);
                setCurrentUser(updatedUser);
            } catch {
                const updatedUser = await client.addToBooksRead(currentUser._id, book._id);
                setCurrentUser(updatedUser);
            }
        }
    }
    const removeFromWishlist = async (bookId: string) => {
        if (currentUser) {
            try {
                console.log("removeFromWishlist clicked")
                const updatedUser = await client.removeFromWishlist(currentUser._id, bookId);
                setCurrentUser(updatedUser);
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
        <div className="profile-font">
            <Header />
            <div className="row">
                <div className="col-md-3 profile-column">
                    <div className="profile-avatar">
                        <img src={require(`../../images/avatar.jpeg`)} alt="Avatar" />
                    </div>
                    <div className="row profile-name">
                        <div className="col-md-8">
                            <h3>{currentUser?.firstName} {currentUser?.lastName}</h3>
                        </div>
                        <div className="col-md-4 text-right">
                            <Link to={`/myProfile/${userId}/Edit`}>
                                <button className="btn">Edit</button>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-11 profile-desc">
                            <h5>{currentUser?.username}</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 profile-desc">
                            <span>Followers:</span> {currentUser?.followers.length}
                        </div>
                        <div className="col-sm-6">
                            <span>Following:</span> {currentUser?.following.length}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-11 profile-desc">
                            <span>Email:</span> {currentUser?.email}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-11 profile-desc">
                            <button onClick={signout} className="btn">Logout</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">
                                Your Followers:
                                {currentUserFollowers?.map((follower: User, index) => {
                                    if (follower) {
                                        console.log("follower: " + JSON.stringify(follower))
                                        return (
                                            <div key={follower._id}>
                                                <Link to={`/profile/${follower._id}`}>
                                                    {(follower.avatar && follower.avatar !== "") ?
                                                        <img src={follower.avatar} alt={follower.avatar} />
                                                        : <img src={require("../../images/avatar.jpeg")} alt={follower.avatar} />}
                                                </Link>
                                                <div>{follower.username}</div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index}>
                                                <p>Follower with ID not found.</p>
                                            </div>
                                        );
                                    }
                                })}
                            </span>
                            
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">
                                Your Followers:
                                {currentUserFollowers?.map((follower: User, index) => {
                                    if (follower) {
                                        console.log("follower: " + JSON.stringify(follower))
                                        return (
                                            <div key={follower._id}>
                                                <Link to={`/profile/${follower._id}`}>
                                                    {(follower.avatar && follower.avatar !== "") ?
                                                        <img src={follower.avatar} alt={follower.avatar} />
                                                        : <img src={require("../../images/avatar.jpeg")} alt={follower.avatar} />}
                                                </Link>
                                                <div>{follower.username}</div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index}>
                                                <p>Follower with ID not found.</p>
                                            </div>
                                        );
                                    }
                                })}
                            </span>
                            
                        </div>
                    </div>
                </div>
                <div className="col-md-9 profile-bg">
                    <div className="row profile-container">
                        <div className="col-md-8 bookclub-section-title">
                            <h4>My BookClubs ({currentUserClubs.length})</h4>
                        </div>
                        <div className="d-flex flex-wrap bookclub-desc">
                            {currentUserClubs?.map((club: Club, index) => {
                                if (club) {
                                    return (
                                        <div key={club._id}>
                                            {(club.organizer && currentUser && currentUser._id && club.organizer === currentUser._id) &&
                                                (<p> User is admin of club </p>)
                                            }
                                            <Link to={`/bookclub/${club._id}`}>
                                                <h5>{club.name}</h5>
                                                <div>
                                                    {(club.imageUrl && club.imageUrl !== "") ? 
                                                    <img src={club.imageUrl} alt={club.name} className="book-cover" /> 
                                                    : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
                                                </div>
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
                    <div className="row profile-container">
                        <div className="col-md-8">
                            <h4>Books I've Read ({currentUserBooksRead.length})</h4>
                            <button onClick={() => navigate('/search-books')}>Add a Book</button>
                        </div>
                        <BooksRead 
                            books={currentUserBooksRead}/>
                    </div>
                    <div className="row profile-container">
                        <div className="col-md-8">
                            <h4>My Book Wishlist ({currentUserBooksWishlist.length})</h4>
                            <button onClick={() => navigate('/search-books')}>Add a Book</button>
                        </div>
                        <Wishlist 
                            books={currentUserBooksWishlist}/>
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MyProfile;