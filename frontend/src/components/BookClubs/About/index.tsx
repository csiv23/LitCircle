import { Club } from "../../types";
import '../index.css';

export default function About({club} : {club : Club}) {
    return (
        <div>
            <div className="col-md-11 club-container">
                <h2>About Our Club</h2>
            </div>
            <div className="col-md-11 club-container club-about">
                {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.name} /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
                <h3 className="club-name">{club.name}</h3>
            </div>
            <div className="col-md-11 club-container">
                <h5>{club.description}</h5>
            </div>
        </div>
    );
}