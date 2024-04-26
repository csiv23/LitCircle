import { Club, Book, User } from "../../types";
import SearchableBooksList from "../BooksList";
import GoogleBooksSearch from "../../SearchBooks/search";
import * as mongooseClient from "../../../mongooseClient"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function BooksRead(
  ) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([] as Book[]);
    
    const {clubId} = useParams();
    const [club, setClub] = useState<Club>({
      _id: "",
      name: "",
      description: "",
      members: [],
      wishlist: [],
      booksRead: [],
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
    const [booksRead, setBooksRead] = useState([] as Book[]);
    const [isAdmin, setIsAdmin] = useState(false);


  const removeBookFromList = async (bookId : string) => {
    if (clubId) {
      await mongooseClient.removeFromClubBooksRead(clubId, bookId);
      setBooksRead(booksRead.filter(book => book._id !== bookId));
      setResults(results.filter(book => book._id !== bookId));
      setSearch("");
  }
}

    const addBookToBooksRead = async (book : Book) => {
      if (clubId) {
        const mongooseBookId = await mongooseClient.createBook(book);
        const mongooseBook = await mongooseClient.getBookById(mongooseBookId);
        await mongooseClient.addToClubBooksRead(clubId, mongooseBookId);
        console.log(mongooseBook);
        setBooksRead([...booksRead, mongooseBook]);
        setResults([...booksRead, mongooseBook]);
        console.log(results);
        setSearch("");
      }
      
    }

    const renderBooks = (books : Book[]) => {
        return (
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                {books.map((book) => (
               <td className="book" key={book._id}>
                    <button onClick={() => {addBookToBooksRead(book)}}>
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

       
     const searchBooks = async (bookQuery : string) => {
      if (clubId) {

        if (booksRead && booksRead.length > 0) {
            return booksRead.filter((book : Book) => {
                return book.title.toLowerCase().startsWith(bookQuery.toLowerCase());
            })
        }
      }
      return [] as Book[]
     
    }


    const renderBooksReadBook = (book : Book) => {
        return (
            <div key={book._id} className="book">
            <Link to={`/book/${book.googleBooksId}`}>
                <div>
                {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                     <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                    : <img src={require("../../../images/emptyBook.jpeg")} alt={book.title} />}
                </div>
                <h5 className="book-title">{book.title}</h5>
                <p className="book-author">{book.author}</p>
            </Link>
            {isAdmin && <button onClick={() => {removeBookFromList(book._id)}} className="btn">
                Remove Book
            </button>}
        </div>
        );
    }

    const renderBooksRead = (books : Book[]) => {
        return (
            <div className="books-list-container">
                {books && books.map(renderBooksReadBook)}
            </div>)
    }
  
      const fullTextSearch = async (text="") => {
        if (text !== "") {
            const results = await searchBooks(text);
            setResults(results);
            console.log(results);
           }
           else {
             setResults(booksRead);
           }
      };

      const setup = async () => {
        if (clubId) {
          const userSession = await mongooseClient.profile();
          setCurrentUser(userSession);
  
          if (userSession) {
              const currentClub = await mongooseClient.getBookClubById(clubId);
              setClub(currentClub);
              console.log(currentClub)
  
  
              const newbooksRead = await mongooseClient.getBooksReadByClub(clubId);
              setBooksRead(newbooksRead);
  
              const response = await mongooseClient.getBooksReadByClub(clubId);
              setBooksRead(response);
  
              const userIsAdmin = currentClub.organizer === userSession._id
              setIsAdmin(userIsAdmin)
              console.log("user is admin: " + userIsAdmin);
          }
          else {
              navigate("/login");
          };
        }

      }

      useEffect(() => {
        setup();
      }, []);

      useEffect(() => {
        console.log("rerender");
        fullTextSearch(search);
     }, [search]);

return (
    <div className="d-flex flex-wrap">
      <div className="col-md-11 club-container">
        <h4>Books We've Read ({booksRead.length})</h4>
        {isAdmin && <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />}
      <div>
        <label htmlFor="searchBookInput"></label>
        <input type="text" 
          className="search-bar"
          id="searchBookInput"
          placeholder="Add book to wishlist"
          value={search}
          onChange={(e) =>
              setSearch(e.target.value)}/>
        <button className="btn"
          onClick={() => {fullTextSearch(search)}}>
          Search
        </button>
        <div>
        {(results &&
          (results.length > 0 || search !== "")) ? renderBooksRead(results)  : renderBooksRead(booksRead)}
        </div>
        </div>
      </div>
    </div>
    )
}