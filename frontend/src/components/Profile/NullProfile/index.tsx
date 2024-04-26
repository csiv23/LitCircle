import { Link } from "react-router-dom";
import Header from "../../Header";

export default function NoProfileFound() {
    return (
        <div>
            <Header/>
            <h1>User Not Found</h1>
            <p>The user you are looking for does not exist or may have been deleted.</p>
            <Link to="/home">
                Return to Home
            </Link>
        </div>

    );
}