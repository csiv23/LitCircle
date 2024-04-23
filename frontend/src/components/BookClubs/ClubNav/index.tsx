import { Club } from "../../types";
import { Link, useLocation } from "react-router-dom";

export default function ClubNav({club} : {club : Club}) {
    const links = [
        {
           label: "About Our Club",
           link: "about"
        },
        {
            label: "Members",
            link: "members"
        },
        {
            label: "Currently Reading",
            link: "currently-reading"
        },
        {
            label: "Next Meeting",
            link: "next-meeting"
        },
        {
            label: "Books We've Read",
            link: "books-read"
        },
        {
            label: "Books We Want to Read",
            link: "wishlist"
        },
    ]
    const pathname = useLocation();
    console.log(pathname)

    return (
    <div className="col-md-3 club-column">
        <div className='club-text'>
        {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.name} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
            <h3 className="club-heading">{club.name}</h3>
            <br/>
            <div className="row mr-2">
                <p>Members: {club.members.length}</p>
            </div>
        </div>
        <div>
        {links.map((link, index) => (
            <li key={index}>
                <Link to={link.link}>{link.label}</Link>
            </li>
        ))}
        </div>
    </div>);
}