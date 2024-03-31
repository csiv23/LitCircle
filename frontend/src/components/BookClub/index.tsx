import { Book } from '../index';

interface MemberProps {
    username: string;
    profilePictureUrl: string;
}

const Member: React.FC<MemberProps> = ({ username, profilePictureUrl }) => {
    return (
        <div className="member">
            <img src={profilePictureUrl} alt={username} className="member-profile-picture" />
            <p>{username}</p>
        </div>
    );
}

function BookClub() {
    return (
        <div className="row">
            <div className="col-md-3">
                <h2>Profile</h2>
                <br/>
                <div >
                    <img src="avatar.jpeg" alt="Avatar" />
                </div>
                <div >
                    <h3> Best Friends Reading </h3>
                </div>
                <div className="row">
                    <div className="col-sm-6"> 
                        <span className="mr-2">Members:</span> 100 
                    </div>
                </div>
            </div>
            <div className="col-md-9">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h4>Our Current Read</h4>
                    </div>
                    <div className="d-flex flex-wrap">
                        <Book title="My Year of Rest and Relaxation" author="Ottessa Moshfegh" coverImageUrl="rest_and_relaxation.jpg" />
                        <p>Description of the book goes here.
                            Or Reviews of books go here.
                            Whatever the crowd desires..
                        </p>
                    </div>
                    <div className="col-md-8">
                        <h4>Books We Want To Read</h4>
                    </div>
                    <div className="col-md-4 text-right">
                        <button className="btn btn-primary">Add Book</button>
                    </div>
                    <div className="d-flex flex-wrap">
                        <Book title="My Year of Rest and Relaxation" author="Ottessa Moshfegh" coverImageUrl="rest_and_relaxation.jpg" />
                    </div>
                    <div className="col-md-8">
                        <h4>Members</h4>
                    </div>
                    <div className="d-flex flex-wrap">
                        <Member username="user1" profilePictureUrl="profile1.jpg" />
                        <Member username="user2" profilePictureUrl="profile2.jpg" />
                        <Member username="user3" profilePictureUrl="profile3.jpg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookClub;