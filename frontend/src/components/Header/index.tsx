import { Link, useLocation } from "react-router-dom";
import "./index.css";

function Header() {
    const links = [
        { label: "Homepage", url: "homepage", icon: "litcircle-logo.png" },
        { label: "Search Bookclubs", url: "search-clubs" },
        { label: "Search Books", url: "search-books" },
        { label: "Profile", url: "profile/0" }
    ];
    const { pathname } = useLocation();
    return(
        <div>
            <ul className="header-row">
                {links.map((link, index) => (
                    <li key={index} className={`header-icon ${link.label === "Profile" ? "profile-label" : ""}`}>
                        <Link to={`/${link.url}`}> 
                            {link.icon && 
                                <img src={require(`../images/${link.icon}`)} alt="Logo"/>}
                            {link.label !== "Homepage" && <span className="header-label">{link.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            <hr className="header-divider"/>
        </div>
    );
}
export default Header;