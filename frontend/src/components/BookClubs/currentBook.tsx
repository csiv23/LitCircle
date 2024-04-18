import { Link } from "react-router-dom";


export default function CurrentBook(currBook : any) {
    return (
        <div className="d-flex flex-wrap">
        <div key={currBook.bookId} className="book">
            <Link to={`/book/${currBook.bookId}`}>
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