

enum Role {
    Organizer = "Organizer",
    Member = "Member",
}

type ObjectId = string;

type User = {
    _id: ObjectId;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
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

type ClubMeeting = {
    meetingDate: Date,
    location: string
}

type NextMeeting = {
    NextMeetingDate: Date,
    NextMeetingLocation: string,
    imageUrl: string,
    name:string
}

type Club = {
    _id: ObjectId;
    name: string;
    imageUrl: string,
    description: string;
    members: ObjectId[];
    booksRead: ObjectId[];
    wishlist: ObjectId[];
    currentBook: ObjectId;
    nextMeeting: ClubMeeting;
    organizer: ObjectId;
}



type Book = {
    _id: ObjectId;
    googleBooksId: string;
    title: string;
    author: string;
    coverImageUrl: string;
    description: string;
    clubsReading: ObjectId[];
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
export type { ObjectId, User, PurchaseLink, Book, Club, Member, ClubMeeting, NextMeeting};
// export { BookComponent, ClubComponent, MemberComponent };