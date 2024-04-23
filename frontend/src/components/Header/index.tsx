import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { User } from "../types";
import * as client from "../../mongooseClient";

function Header() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [currentUser, setCurrentUser] = useState<User>();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userSession = await client.profile();
                setCurrentUser(userSession);
            } catch (error) {
                navigate("/login");
            }
        }
        fetchProfile();
    }, [])
    const links = [
        { label: "Homepage", url: "home", icon: "litcircle-logo.png" },
        { label: "Search Bookclubs", url: "search-clubs" },
        { label: "Search Books", url: "search-books" },
        { label: "Profile", url: `profile/${currentUser?._id}` }
    ];
    
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