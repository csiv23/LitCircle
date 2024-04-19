enum Role {
    Organizer = "Organizer",
    Member = "Member",
}

type ObjectId = string;

type User = {
    userId: ObjectId;
    Username: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    followers: ObjectId[];
    following: ObjectId[];
    wishlist: ObjectId[];
    booksRead: ObjectId[];
    bookClubs: ObjectId[];
    avatar: string;
}

type PurchaseLink = {
    name: string;
    url: string;
}

type Club = {
    clubId: ObjectId;
    name: string;
    description: string;
    members: ObjectId[];
    booksRead: ObjectId[];
    wishlist: ObjectId[];
    currentBook: ObjectId;
    nextMeeting: Date;
    organzier: ObjectId;
    clubImage: string;
}

type Book = {
    bookId: ObjectId;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    clubsReading: ObjectId[];
    readers: ObjectId[];
    purchaseLinks: PurchaseLink[];
}


type Member = {
    username: string;
    profilePictureUrl: string;
}

type MemberType = (props: Member) => JSX.Element;

const MemberComponent: MemberType = ({ username, profilePictureUrl }) => {
    return (
        <div className="member">
            <img src={profilePictureUrl} alt={username} className="member-profile-picture" />
            <p>{username}</p>
        </div>
    );
}

export { Role };
export type { ObjectId, User, PurchaseLink, Book, Club, Member };
// export { BookComponent, ClubComponent, MemberComponent };