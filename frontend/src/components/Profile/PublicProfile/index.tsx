import { Link, useNavigate, useParams } from "react-router-dom";
import "../index.css";
import { User, Book, Club, ObjectId } from "../../types";
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from '../../../database';
import Header from "../../Header";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../../mongooseClient";
import { useEffect, useState } from "react";
import { setCurrentUser } from "../../../reducers/usersReducer";
import BooksRead from "../MyProfile/BooksRead";
import Wishlist from "../MyProfile/Wishlist";

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
    const [publicUserFollowing, setPublicUserFollowing] = useState<User[]>([]);

    useEffect(() => {
        fetchPublicUser();
        fetchCurrentUser();
    }, [userId])
    useEffect(() => {
        if (publicUser) {
            fetchPublicUsersClubs();
            fetchPublicUsersBooksRead();
            fetchPublicUsersBooksWishlist();
            fetchPublicUserFollowers();
            fetchPublicUserFollowing();
        }
    }, [publicUser]);

    const fetchPublicUser = async () => {
        try {
            if (userId) {
                const fetchedUser = await client.getUserById(userId);
                setPublicUser(fetchedUser);
            }
        }
        catch (e) {
            navigate('/profile')
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
        publicUser?.bookClubs.map((bookClub: any) => userBookClubIds.push(bookClub.ClubId));
        const commonClubs = allClubs.filter((club: Club) => userBookClubIds.includes(club._id));
        setPublicUserClubs(commonClubs);
    };
    const fetchPublicUsersBooksRead = async () => {
        const allBooks = await client.getBooks();
        const userBooksIds: ObjectId[] = [];
        publicUser?.booksRead.map((bookId: ObjectId) => userBooksIds.push(bookId));
        const commonBooks = allBooks.filter((book: Book) => userBooksIds.includes(book._id));
        setPublicUserBooksRead(commonBooks);
    };
    const fetchPublicUsersBooksWishlist = async () => {
        const allBooks = await client.getBooks();
        const userBooksIds: ObjectId[] = [];
        publicUser?.wishlist.map((bookId: ObjectId) => userBooksIds.push(bookId));
        const commonBooks = allBooks.filter((book: Book) => userBooksIds.includes(book._id));
        setPublicUserBooksWishlist(commonBooks);
    };
    const follow = async () => {
        if (currentUser) {
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
                const followers = allUsers.filter((user: User) => {
                    if (publicUser.followers.includes(user._id) && user._id == currentUser?._id) {
                        console.log("setIsFollowing(true)")
                        setIsFollowing(true);
                    }
                    return publicUser.followers.includes(user._id)
                });
                setPublicUserFollowers(followers);
            } catch (error) {
                console.log("PublicProfile failed to fetch publicUser followers");
            }
        }
    }
    const fetchPublicUserFollowing = async () => {
        if (publicUser) {
            try {
                const allUsers = await client.getUsers();
                const following = allUsers.filter((user: User) => {
                    return publicUser.following.includes(user._id)
                });
                setPublicUserFollowing(following);
            } catch (error) {
                console.log("PublicProfile failed to fetch publicUser following");
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
                    <div className="btn-align">
                        {isFollowing ? (
                            <button onClick={unfollow} className="btn">Unfollow</button>
                        ) : (
                            <button onClick={follow} className="btn">Follow</button>
                        )}
                    </div>
                    <div className="row">
                        <div className="profile-desc">
                            Followers ({publicUserFollowers.length}):
                            <div className="followers-container">
                            {publicUserFollowers?.map((follower: User, index) => {
                                if (follower) {
                                    console.log("follower: " + JSON.stringify(follower))
                                    return (
                                        <div key={follower._id} className="follower-item">
                                            <Link to={`/profile/${follower._id}`}>
                                                {(follower.avatar && follower.avatar !== "") ?
                                                    <img src={follower.avatar} alt={follower.avatar} />
                                                    : <img src={require("../../images/avatar.jpeg")} alt={follower.avatar} />}
                                            </Link>
                                            <div className="username-container">{follower.username}</div>
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
                    </div>
                    <div className="row">
                        <div className="profile-desc">
                        Following ({publicUserFollowing.length}):
                            <div className="followers-container">
                                {publicUserFollowing?.map((following: User, index) => {
                                    if (following) {
                                        console.log("following: " + JSON.stringify(following))
                                        return (
                                            <div key={following._id} className="follower-item">
                                                <Link to={`/profile/${following._id}`}>
                                                    {(following.avatar && following.avatar !== "") ?
                                                        <img src={following.avatar} alt={following.avatar} />
                                                        : <img src={require("../../images/avatar.jpeg")} alt={following.avatar} />}
                                                </Link>
                                                <div className="username-container">{following.username}</div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index}>
                                                <p>Following with ID not found.</p>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9 profile-bg">
                    <div className="row col-md-11 profile-container">
                        <div className="col-md-8 ">
                            <h4>My BookClubs ({publicUserClubs.length})</h4>
                        </div>
                        <div className="d-flex flex-wrap bookclub-desc">
                            {publicUserClubs.map((club: Club, index) => {
                                if (club) {
                                    return (
                                        <div key={club._id} className="bookclub-container">
                                            <Link to={`/bookclub/${club._id}`}>
                                                <h5>{club.name}</h5>
                                                <div>
                                                    {(club.imageUrl && club.imageUrl !== "") ? 
                                                    <img src={club.imageUrl} alt={club.name} className="book-cover" /> 
                                                    : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
                                                </div>
                                            </Link>
                                            {(club.organizer && publicUser && publicUser._id && club.organizer === publicUser._id) &&
                                                (<p className="club-admin-title"> Club Admin </p>)
                                            }
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
                    <div className="row col-md-11 profile-container">
                        <div className="col-md-10">
                            <h4>Books I've Read ({publicUserBooksRead.length})</h4>
                        </div>
                        <BooksRead books={publicUserBooksRead}/>
                    </div>
                    <div className="row col-md-11 profile-container">
                        <div className="col-md-10">
                            <h4>My Book Wishlist ({publicUserBooksWishlist.length})</h4>
                        </div>
                        <Wishlist books={publicUserBooksWishlist}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PublicProfile;