import { Club, Book, User } from "../../types";
import SearchableBooksList from "../BooksList";
import GoogleBooksSearch from "../../SearchBooks/search";
import * as mongooseClient from "../../../mongooseClient"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Wishlist(
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
    const [wishlist, setWishlist] = useState([] as Book[]);
    const [isAdmin, setIsAdmin] = useState(false);


  const removeBookFromList = async (bookId : string) => {
    if (clubId) {
      await mongooseClient.removeBookFromClubWishlist(clubId, bookId);
      setWishlist(wishlist.filter(book => book._id !== bookId));
      setResults(results.filter(book => book._id !== bookId));
  }
}

    const addBookToWishlist = async (book : Book) => {
      if (clubId) {
        const mongooseBookId = await mongooseClient.createBook(book);
        const mongooseBook = await mongooseClient.getBookById(mongooseBookId);
        await mongooseClient.addToClubWishlist(clubId, mongooseBookId);
        console.log(mongooseBook);
        setWishlist([...wishlist, mongooseBook]);
        // setResults([...wishlist, mongooseBook]);
        console.log(results);
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
                    <button onClick={() => {addBookToWishlist(book)}}>
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

        if (wishlist && wishlist.length > 0) {
            return wishlist.filter((book : Book) => {
                return book.title.toLowerCase().startsWith(bookQuery.toLowerCase());
            })
        }
      }
      return [] as Book[]
     
    }


    const renderWishlistBook = (book : Book) => {
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
            {isAdmin && <button onClick={() => {removeBookFromList(book._id)}}>
                Remove Book
            </button>}
        </div>
        );
    }

    const renderWishlist = (books : Book[]) => {
        return (
            <div>
                {books && books.map(renderWishlistBook)}
            </div>)
    }
  
      const fullTextSearch = async (text="") => {
          if (text !== "") {
           const results = await searchBooks(text);
           setResults(results);
           console.log(results);
          }
          else {
              if (results && results.length > 0) {
                setResults(results);
              }
              else setResults(wishlist);
          }
          console.log(results);
      };

      const setup = async () => {
        if (clubId) {
          const userSession = await mongooseClient.profile();
          setCurrentUser(userSession);
  
          if (userSession) {
              const currentClub = await mongooseClient.getBookClubById(clubId);
              setClub(currentClub);
              console.log(currentClub)
  
  
              const newWishlist = await mongooseClient.getWishlistByClub(clubId);
              setWishlist(newWishlist);
  
              const response = await mongooseClient.getWishlistByClub(clubId);
              setWishlist(response);
  
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
     }, [results]);

return (
    <div className="d-flex flex-wrap">
    <div>
    {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.imageUrl} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
    </div>
    <h4>
        Books We Want to Read
    </h4>
    <br></br>
    <h4>{wishlist.length} Books</h4>

    {isAdmin && <GoogleBooksSearch renderBooks={renderBooks} searchPath={false} />}
    <div>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      <button
        onClick={() => {fullTextSearch(search)}}>
        Search
      </button>
      <div>
      {(results &&
        results.length > 0) ? renderWishlist(results)  : renderWishlist(wishlist)}
      </div>

    </div>
    </div>
    )
}