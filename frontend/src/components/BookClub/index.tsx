import './index.css';
import { Link, useParams } from 'react-router-dom';
import { User, Book, Club, ObjectId } from "../types";
import { users as dbUsers, books as dbBooks, bookclubs as dbBookclubs} from '../../database';
import Header from '../Header';

function BookClub({ bookclubs }: {bookclubs: Club[]}) {
    const { clubId } = useParams();
    const club = dbBookclubs.bookclubs.find((club) => club.clubId === clubId)
    if (!club) {
        return <div>Club not found</div>;
    }

    const findBookbyId = (bookId: ObjectId) => {
        return dbBooks.books.find(book => book.bookId === bookId);
    };
    const findUserbyId = (userId: ObjectId) => {
        return dbUsers.users.find(user => user.userId === userId);
    };

    const currBook = findBookbyId(club.currentBook);
    if (!currBook) {
        return <div>There is no current book</div>;
    }

    const organizer = findUserbyId(club.organizer);
    if (!organizer) {
        return <div>No current organizer</div>;
    }

    return (
        <div>
            <Header />
            <div className="row">
                <div className="col-md-3">
                    <h2>BookClub</h2>
                    <br/>
                    <div>
                        <img className="club-profile-picture"
                            src={require(`../images/${club.clubImage}`)} alt={club.name} />
                    </div>
                    <div >
                        <h3>{club.name}</h3>
                    </div>
                    <div className="row">
                        <h5>Organizer: {organizer.username} </h5>
                    </div>
                    <div className="row mr-2">
                        <p>Members: {club.members.length}</p>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h4>About Us</h4>
                            <p>{club.description}</p>
                        </div>
                        <div className="col-md-8">
                            <h4>Our Current Read</h4>
                        </div>
                        <div className="d-flex flex-wrap">
                            <div key={currBook.bookId} className="book">
                                <Link to={`/book/${currBook.bookId}`}>
                                    <img className='book-cover'
                                        src={require(`../images/${currBook.coverImage}`)} 
                                        alt={currBook.title} />
                                    <h5 >{currBook.title}</h5>
                                    <p>{currBook.author}</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h4>Books We've Read</h4>
                        </div>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary">Add Book</button>
                        </div>
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                            {club.booksRead.map((bookId: ObjectId) => {
                                const book = findBookbyId(bookId);
                                if (book) {
                                    return (
                                        <div key={book.bookId} className="book">
                                            <Link to={`/book/${book.bookId}`}>
                                            <img src={require(`../images/${book.coverImage}`)} 
                                                alt={book.title} />
                                                <h5 >{book.title}</h5>
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
                            <h4>Book Wishlist</h4>
                        </div>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-primary">Add Book</button>
                        </div>
                        <div className="col-lg book-container book-cover d-flex flex-wrap">
                            {club.wishlist.map((bookId: ObjectId) => {
                                const book = findBookbyId(bookId);
                                if (book) {
                                    return (
                                        <div key={book.bookId} className="book">
                                            <Link to={`/book/${book.bookId}`}>
                                            <img src={require(`../images/${book.coverImage}`)} 
                                                alt={book.title} />
                                                <h5 >{book.title}</h5>
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
                            <h4>Members</h4>
                        </div>
                        <div className="row">
                            <div className="col-lg">
                                <div className="d-flex flex-wrap">
                                    {club.members.map((userId: ObjectId) => {
                                        const user = findUserbyId(userId);
                                        if (user) {
                                            return (
                                                <div key={user.userId} className="member">
                                                    <Link to={`/public-profile/${user.userId}`}>
                                                        <img className="member-profile-picture" 
                                                            src={require(`../images/${user.avatar}`)} alt={user.username}/>
                                                        <p>{user.username}</p>
                                                    </Link>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={userId}>
                                                    <p>User with ID {userId} not found.</p>
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
        </div>
    );
}

export default BookClub;