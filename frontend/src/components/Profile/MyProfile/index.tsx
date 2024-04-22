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

function getURL( book: Book  ) {
    return `/book/${book.title.replace(/\s+/g, '-').toLowerCase()}`
}

function MyProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userId } = useParams();
    // const user = dbUsers.users.find((user) => user.userId === userId); // Local Testing database
    let currentUser = useSelector((state: any) => state.users.currentUser);
    console.log("MyProfile currentUser: " + JSON.stringify(currentUser));

    useEffect(() => {
        if (!currentUser || currentUser?._id !== userId) {
            // Display the public profile
            navigate(`/profile/${userId}`);
        }
    }, [])

    // if (!user) {
    //     return <div>User not found</div>;
    // }
    const findClubById = async (clubId: ObjectId) => {
        const allClubs = await client.getClubs();
        console.log("findClubById getClubs: " + JSON.stringify(allClubs));
        return allClubs?.find((club: any) => club.clubId === clubId); // FIX
    };
    findClubById('660593f3aceb52dac7be9f68');
    const findBookbyId = (bookId: ObjectId) => {
        return dbBooks.books.find(book => book.bookId === bookId);
    };
    const signout = async () => {
        console.log("currentUser before signout: " + JSON.stringify(currentUser));
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/login");
    };
    console.log("currentUser?.bookClubs: " + JSON.stringify(currentUser?.bookClubs))

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
                            {/* {currentUser?.bookClubs.map((clubId: ObjectId) => {
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
                            })} */}
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
                            {/* {currentUser?.booksRead.map((bookId: ObjectId) => {
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
                            })} */}
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
                            {/* {currentUser?.wishlist.map((bookId: ObjectId) => {
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
                            })} */}
                        </div>
                    </div>
                </div>
                <button onClick={signout}>Logout</button>
            </div>
        </div>
    );
}
export default MyProfile;