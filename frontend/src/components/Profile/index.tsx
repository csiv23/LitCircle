import { Link, useLocation } from "react-router-dom";
import "./index.css";

interface BookProps {
    title: string;
    author: string;
    coverImageUrl: string;
}

interface ClubProps {
    name: string;
    members: string;
    clubImage: string;
}

const Book: React.FC<BookProps> = ({ title, author, coverImageUrl }) => {
    return (
        <div className="book">
            <img src={coverImageUrl} alt={title} className="book-cover" />
            <h5>{title}</h5>
            <p>{author}</p>
        </div>
    );
}

const Club: React.FC<ClubProps> = ({ name, members, clubImage }) => {
    return (
        <div className="club">
            <h5>{name}</h5>
            <img src={clubImage} alt={name} className="club-cover" />
            <p>Members: {members}</p>
        </div>
    )
}

function Profile({ firstName, lastName }: {
    firstName: string;
    lastName: string;
}) {
    return (
        <div className="row">
            <div className="col-md-3">
                <h2>Profile</h2>
                <br/>
                <div className="profile-avatar">
                    <img src="avatar.jpeg" alt="Avatar" />
                </div>
                <div className="profile-name">
                    <h3>{firstName} {lastName}</h3>
                </div>
                <div className="row">
                    <div className="col-sm-6"> 
                        <span className="mr-2">Followers:</span> 100 
                    </div>
                    <div className="col-sm-6">
                        <span className="mr-2">Following:</span> 2 
                    </div>
                </div>
            </div>
            <div className="col-md-9">
                <div className="row">
                    <h4>My BookClubs</h4>
                    <div className="d-flex flex-wrap">
                        <Club name="Best Friends Reading" members="4" clubImage="friends.jpeg" />
                    </div>
                </div>
                <div className="row">
                    <h4>My Favorite Books</h4>
                    <div className="d-flex flex-wrap">
                        <Book title="Fifty Shades of Grey" author="E.L. James" coverImageUrl="fifty_shades.jpg" />
                        <Book title="My Year of Rest and Relaxation" author="Ottessa Moshfegh" coverImageUrl="rest_and_relaxation.jpg" />
                    </div>
                </div>
                <div className="row">
                    <h4>My Book Wishlist</h4>
                    <div className="d-flex flex-wrap">
                        <Book title="Fifty Shades Darker" author="E.L. James" coverImageUrl="fifty_shades.jpg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;