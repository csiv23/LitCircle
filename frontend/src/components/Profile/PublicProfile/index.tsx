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
    const { userId } = useParams();

    const [currentUser, setCurrentUser] = useState<User>();
    const [publicUser, setPublicUser] = useState<User>();
    const [publicUserClubs, setPublicUserClubs] = useState<Club[]>([]);
    const [publicUserBooksRead, setPublicUserBooksRead] = useState<Book[]>([]);
    const [publicUserBooksWishlist, setPublicUserBooksWishlist] = useState<Book[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>();
    const [publicUserFollowers, setPublicUserFollowers] = useState<User[]>([]);
    useEffect(() => {
        fetchPublicUser();
        fetchCurrentUser();
    }, [])
    useEffect(() => {
        if (publicUser) {
            fetchPublicUsersClubs();
            fetchPublicUsersBooksRead();
            fetchPublicUsersBooksWishlist();
            fetchPublicUserFollowers();
        }
    }, [publicUser]);

    const fetchPublicUser = async () => {
        if (userId) {
            const fetchedUser = await client.getUserById(userId);
            setPublicUser(fetchedUser);
        }
    }
    const fetchCurrentUser = async () => {
        try {
            const userSession = await client.profile();
            setCurrentUser(userSession);
            if (publicUser) {
                setIsFollowing(userSession.following.includes(publicUser._id));
            }
        } catch (error) {
            console.log("couldn't fetch currentUser");
        }
    }
    const fetchPublicUsersClubs = async () => {
        const allClubs = await client.getClubs();
        const userBookClubIds: ObjectId[] = [];
        publicUser?.bookClubs.map((bookClub: any) => userBookClubIds.push(bookClub["_id"]));
        const commonClubs = allClubs.filter((club: Club) => userBookClubIds.includes(club["_id"]));
        setPublicUserClubs(commonClubs);
    };
    const fetchPublicUsersBooksRead = async () => {
        const allBooks = await client.getBooks();
        const userBooksIds: ObjectId[] = [];
        publicUser?.booksRead.map((bookId: ObjectId) => userBooksIds.push(bookId));
        const commonBooks = allBooks.filter((book: Book) => userBooksIds.includes(book["_id"]));
        setPublicUserBooksRead(commonBooks);
    };
    const fetchPublicUsersBooksWishlist = async () => {
        const allBooks = await client.getBooks();
        const userBooksIds: ObjectId[] = [];
        publicUser?.wishlist.map((bookId: ObjectId) => userBooksIds.push(bookId));
        const commonBooks = allBooks.filter((book: Book) => userBooksIds.includes(book["_id"]));
        setPublicUserBooksWishlist(commonBooks);
    };
    const follow = async () => {
        if (currentUser) {
            console.log("follow button clicked")
            if (publicUser) {
                try {
                    await client.followUser(currentUser._id, publicUser?._id);
                    setPublicUser(await client.getUserById(publicUser._id));
                    setCurrentUser(await client.profile());
                    setIsFollowing(true);
                } catch (error) {
                    console.log("PublicProfile failed to follow user");
                }
            }
        } else {
            navigate("/login");
        }
    }
    const unfollow = async () => {
        if (currentUser) {
            console.log("unfollow button clicked")
            if (publicUser) {
                try {
                    await client.unfollowUser(currentUser._id, publicUser?._id);
                    setPublicUser(await client.getUserById(publicUser._id));
                    setCurrentUser(await client.profile());
                    setIsFollowing(false);
                } catch (error) {
                    console.log("PublicProfile failed to follow user");
                }
            }
        } else {
            navigate("/login");
        }
    }
    const fetchPublicUserFollowers = async () => {
        if (publicUser) {
            try {
                const allUsers = await client.getUsers();
                console.log("allUsers: " + JSON.stringify(allUsers));
                const followers = allUsers.filter((user: User) => publicUser.followers.includes(user._id));
                console.log("followers: " + JSON.stringify(followers));
                setPublicUserFollowers(followers);
                console.log("publicUserFollowers: " + JSON.stringify(publicUserFollowers))
            } catch (error) {

            }
        }
    }

    if (currentUser?._id == userId) {
        navigate(`/myProfile/${currentUser?._id}`);
    }

    return (
        <div>
            <Header />
            <div className="row profile-font">
                <div className="col-md-3 profile-column">
                    <div className="profile-avatar">
                        <img src={require(`../../images/avatar.jpeg`)} alt="Avatar" />
                    </div>
                    <div className="row profile-name">
                        <h3>
                            {publicUser?.firstName} {publicUser?.lastName}
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-sm-11 profile-desc">
                            <h5>{publicUser?.username}</h5>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-sm-6 profile-desc">
                            <span>Followers:</span> {publicUser?.followers.length}
                        </div>
                        <div className="col-sm-6">
                            <span>Following:</span> {publicUser?.following.length}
                        </div>
                    </div>
                    <div className="btn-align">
                        {isFollowing ? (
                            <button onClick={unfollow} className="btn">Unfollow</button>
                        ) : (
                            <button onClick={follow} className="btn">Follow</button>
                        )}
                    </div>
                    <div>
                        Followers:
                        {publicUserFollowers?.map((follower: User, index) => {
                            if (follower) {
                                console.log("follower: " + JSON.stringify(follower))
                                return (
                                    <div key={follower._id}>
                                        <div>{follower.username}</div>
                                        <Link to={`/profile/${follower._id}`}>
                                            {(follower.avatar && follower.avatar !== "") ?
                                                <img src={follower.avatar} alt={follower.avatar} />
                                                : <img src={require("../../images/avatar.jpeg")} alt={follower.avatar} />}
                                        </Link>
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
                    </div>
                    <div>
                        Followers:
                        {publicUserFollowers?.map((follower: User, index) => {
                            if (follower) {
                                console.log("follower: " + JSON.stringify(follower))
                                return (
                                    <div key={follower._id}>
                                        <div>{follower.username}</div>
                                        <Link to={`/profile/${follower._id}`}>
                                            {(follower.avatar && follower.avatar !== "") ?
                                                <img src={follower.avatar} alt={follower.avatar} />
                                                : <img src={require("../../images/avatar.jpeg")} alt={follower.avatar} />}
                                        </Link>
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
                    </div>
                </div>
                <div className="col-md-9 profile-bg">
                    <div className="row">
                        <div className="col-md-11 profile-container">
                            <h4>My BookClubs</h4>
                            <div className="d-flex flex-wrap bookclub-pfp">
                                {publicUserClubs.map((club: Club, index) => {
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
                    </div>
                    <div className="row">
                        <div className="col-md-11 profile-container">
                            <h4>Books I've Read</h4>
                            <div className="col-lg book-container">
                                {publicUserBooksRead.map((book: Book, index) => {
                                    if (book) {
                                        return (
                                            <div key={index} className="book">
                                                <Link to={`/book/${book._id}`}>
                                                <div>
                                                    {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                                                    <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                                                    : <img src={require("../../../images/emptyBook.jpeg")} alt={book.title} />}
                                                </div>
                                                    <h5>{book.title}</h5>
                                                    <p className="book-author">{book.author}</p>
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
                    </div>
                    <div className="row">
                        <div className="col-md-11 profile-container">
                            <h4>My Book Wishlist</h4>
                            <div className="col-lg book-container">
                                {publicUserBooksWishlist.map((book: Book, index) => {
                                    if (book) {
                                        return (
                                            <div key={index} className="book">
                                                <Link to={`/book/${book._id}`}>
                                                <div>
                                                    {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                                                    <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                                                    : <img src={require("../../../images/emptyBook.jpeg")} alt={book.title} />}
                                                </div>
                                                    <h5>{book.title}</h5>
                                                    <p className="book-author">{book.author}</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PublicProfile;