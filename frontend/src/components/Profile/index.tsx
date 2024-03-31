import { Link } from "react-router-dom";
import "./index.css";
import { Book, Club } from "../index"


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
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <Link to={"bookclub"} className="btn">
                        My BookClubs </Link>
                    </div>
                    <div className="col-md-4 text-right">
                        <button className="btn btn-primary">Add BookClub</button>
                    </div>
                    <div className="d-flex flex-wrap">
                        <Club name="Best Friends Reading" members="4" clubImage="friends.jpeg" />
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h4>My Favorite Books</h4>
                    </div>
                    <div className="col-md-4 text-right">
                        <button className="btn btn-primary">Add Book</button>
                    </div>
                    <div className="d-flex flex-wrap">
                        <Book title="Fifty Shades of Grey" author="E.L. James" coverImageUrl="fifty_shades.jpg" />
                        <Book title="My Year of Rest and Relaxation" author="Ottessa Moshfegh" coverImageUrl="rest_and_relaxation.jpg" />
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h4>My Book Wishlist</h4>
                    </div>
                    <div className="col-md-4 text-right">
                        <button className="btn btn-primary">Add Book</button>
                    </div>
                    <div className="d-flex flex-wrap">
                        <Book title="Fifty Shades Darker" author="E.L. James" coverImageUrl="fifty_shades.jpg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;