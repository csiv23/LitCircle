import { Club } from "../../types";

export default function About({club} : {club : Club}) {
    return (
        <div>
            <div className="col-md-11 club-container">
                <h1>About Our Club</h1>
            </div>
            <div className="col-md-11 club-container">
                {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.name} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
            </div>
            <div className="col-md-11 club-container">
                <h4>{club.name}</h4>
            </div>
            <div className="col-md-11 club-container">
                <p>{club.description}</p>
            </div>
        </div>
    );
}