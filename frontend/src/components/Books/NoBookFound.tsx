import { Link } from "react-router-dom";
import Header from "../Header";

export default function NoBookFound() {
    return (
        <div>
            <Header/>
            <h1>Book Not Found</h1>
            <p>The book you are looking for does not exist or may have been deleted.</p>
            <Link to="/home">
                Return to Home
            </Link>
        </div>

    );
}