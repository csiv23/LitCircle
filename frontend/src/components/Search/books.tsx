import * as client from "../../client";
import { Link } from "react-router-dom";
export default function GoogleBooks(
  { books }: { books: any[] }) {

 return (
   <div className="table-responsive">
     <table className="table">
       <tbody>
         <tr>
         {books.map((book) => (
        <td className="book" key={book.id}>
            <Link
                to={`/Book/${book.id}`}>
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