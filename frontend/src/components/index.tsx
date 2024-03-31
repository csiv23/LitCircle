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

export {Book, Club};