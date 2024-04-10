import { Link, useLocation } from "react-router-dom";
import "./index.css";

function Header() {
    const links = [
        { label: "Homepage", url: "homepage" },
        { label: "Search Bookclubs", url: "search-bookclubs" },
        { label: "Search Books", url: "search-books" },
        { label: "Profile", url: "profile/0" }
    ];
    const { pathname } = useLocation();
    return(
        <ul className="header-row">
            {links.map((link, index) => (
                <li key={index} className="header-icon">
                    <Link to={`/${link.url}`}> 
                    {link.label !== "Logo" && <span className="label">{link.label}</span>}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
export default Header;