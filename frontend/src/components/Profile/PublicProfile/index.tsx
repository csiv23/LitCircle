import { Link, useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { User, Book, Club, ObjectId } from "../../types";
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from '../../../database';
import Header from "../../Header";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../../mongooseClient";
import { useEffect, useState } from "react";
import { setCurrentUser } from "../../../reducers/usersReducer";

function getURL( book: Book  ) {
    return `/book/${book.title.replace(/\s+/g, '-').toLowerCase()}`
}

function PublicProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId } = useParams();

    // REMOVE THIS WHEN DONE TESTING
    const user = dbUsers.users.find((user) => user.userId === userId)

    const currentUser = useSelector((state: any) => state.users.currentUser);
    console.log("PublicProfile. The currentUser is: " + JSON.stringify(currentUser));
    if (currentUser?._id == userId) {
        navigate(`/myProfile/${currentUser?._id}`);
    }
    // Get public profile user
    const [publicUser, setPublicUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchPublicUser = async () => {
            if (userId) {
                const fetchedUser = await client.getUserById(userId);
                setPublicUser(fetchedUser);
            }
        }
        fetchPublicUser();
    }, [currentUser])

    const follow = async () => {
        if (currentUser) {
            console.log("follow button clicked")
            if (publicUser) {
                try {
                    client.followUser(currentUser._id, publicUser?._id);
                    setPublicUser(await client.getUserById(publicUser._id))
                    dispatch(setCurrentUser(await client.getUserById(currentUser._id)));
                    // dispatch(setCurrentUser({...currentUser, followers: [...currentUser.followers, ]}))
                } catch (error) {
                    console.log("PublicProfile failed to follow user");
                }
            }
            // Dispatch setCurrentUser to update the currentUser
        } else {
            navigate("/login");
        }
    }
    

    if (!user) {
        return <div>User not found</div>;
    }

    const findClubById = (clubId: ObjectId) => {
        return dbBookclubs.bookclubs.find(club => club.clubId === clubId);
    };

    const findBookbyId = (bookId: ObjectId) => {
        return dbBooks.books.find(book => book.bookId === bookId);
    };

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
                            {user.firstName} {user.lastName}
                            <Link to={"/profile/:userId"}>
                                <button className="btn btn-secondary ml-2">Edit</button>
                            </Link>
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">Followers:</span> {user.followers.length}
                        </div>
                        <div className="col-sm-6">
                            <span className="mr-2">Following:</span> {user.following.length}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <span className="mr-2">Email:</span> {user.email}
                        </div>
                    </div>
                    <div>
                        <button onClick={follow}>Follow</button>
                        <button>Unfollow</button>
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
                            {user.bookClubs.map((clubId: ObjectId) => {
                                const club = findClubById(clubId);
                                if (club) {
                                    return (
                                        <div key={club.clubId}>
                                            <Link to={`/bookclub/${club.clubId}`}>
                                                <h5>{club.name}</h5>
                                                <img src={require(`../../images/${club.clubImage}`)} alt={club.name} className="book-cover" />
                                            </Link>
                                            <p>Members: {club.members.length}</p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={clubId}>
                                            <p>Club with ID {clubId} not found.</p>
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
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                            {user.booksRead.map((bookId: ObjectId) => {
                                const book = findBookbyId(bookId);
                                if (book) {
                                    return (
                                        <div key={book.bookId} className="book">
                                            <Link to={`/book/${book.bookId}`}>
                                                <img src={require(`../../images/${book.coverImage}`)}
                                                    alt={book.title} />
                                                <h5>{book.title}</h5>
                                                <p>{book.author}</p>
                                            </Link>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={bookId}>
                                            <p>Book with ID {bookId} not found.</p>
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
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary">Add Book</button>
                        </div>
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                            {user.wishlist.map((bookId: ObjectId) => {
                                const book = findBookbyId(bookId);
                                if (book) {
                                    return (
                                        <div key={book.bookId} className="book">
                                            <Link to={`/book/${book.bookId}`}>
                                                <img src={require(`../../images/${book.coverImage}`)}
                                                    alt={book.title} />
                                                <h5>{book.title}</h5>
                                                <p>{book.author}</p>
                                            </Link>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={bookId}>
                                            <p>Book with ID {bookId} not found.</p>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PublicProfile;