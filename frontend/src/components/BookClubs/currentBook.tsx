import { Link } from "react-router-dom";
import { Book } from "../types";


export default function CurrentBook({currBook} : {currBook : Book}) {

    return (
        <div className="d-flex flex-wrap">
        <div key={currBook._id} className="book">
            <Link to={`/book/${currBook.googleBooksId}`}>
                <div>
                {(currBook.coverImageUrl && currBook.coverImageUrl !== "") ? 
                     <img src={currBook.coverImageUrl} alt={currBook.title} className="book-cover" /> 
                    : <img src={require("../../images/emptyBook.jpeg")} alt={currBook.title} />}
                </div>
                <h5 >{currBook.title}</h5>
                <p>{currBook.author}</p>
            </Link>
        </div>
    </div>
    );

}