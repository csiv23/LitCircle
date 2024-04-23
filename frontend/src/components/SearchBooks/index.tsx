import GoogleBooksSearch from "./ search";
import { Routes, Route, Navigate } from "react-router";
import { Link } from "react-router-dom";
import { Book } from "../types";

export default function GoogleAPI() {

    const renderBooks = (books : Book[]) => {
      return (
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <tr>
              {books.map((book) => (
             <td className="book" key={book._id}>
                 <Link
                     to={`/book/${book.googleBooksId}`}>
                         {(book.coverImageUrl && book.coverImageUrl !== "") ? 
                          <img src={book.coverImageUrl} alt={book.title} className="book-cover" /> 
                         : <img src={require("../../images/emptyBook.jpeg")} 
                         alt={book.title} className="book-cover"/>}
                     <h3>{book.title}</h3>
                     <p> Author: {book.author} </p>
                     <p> Description: {book.description} </p>
                 </Link>
             </td>
             ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return (
        <div className="container-fluid">
          <h1>Search Books</h1>
          <Routes>
       <Route path="/" element={<GoogleBooksSearch renderBooks={renderBooks} searchPath={true}/>} />
       <Route path="/:title" element={<GoogleBooksSearch renderBooks={renderBooks} searchPath={true}/>} />
        </Routes>
        </div>
      );
     
}
   
   