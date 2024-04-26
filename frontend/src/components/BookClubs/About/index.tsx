import { useParams } from "react-router";
import { Club, User } from "../../types";
import '../index.css';

export default function About(
    {club, isAdmin, updateClub, setClub} 
    : 
    {
        club : Club,  
        isAdmin : boolean,
        updateClub : () => void,
        setClub : (club : Club) => void;
    }) {

    const {clubId} = useParams();
    
    return (
        <div>
            <div className="col-md-11 club-container">
                <h2>About Our Club</h2>
            </div>
            <div className="col-md-11 club-container club-about">
                <div className="club-about-pic">
                    {(club.imageUrl && club.imageUrl !== "") ? 
                    <img src={club.imageUrl} alt={club.name} /> 
                    : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
                </div>
                {isAdmin && 
                <>
                <label htmlFor="clubImageInput">Change Club Image:</label>
                <input placeholder={club.imageUrl ? club.imageUrl : "No image"}
                    className="form-control inline"
                    id="clubImageInput"
                    onChange={(e) => { setClub({ ...club, imageUrl: e.target.value }); } } />
                    <button onClick={updateClub} className="btn">Save</button></>}
            </div>
            <div className="col-md-11 club-container">
                <h3>{club.name}</h3>
                {isAdmin &&
                <>
                <label htmlFor="clubNameInput">Change Club Name:</label>
                <input placeholder={club.name}
                    id="clubNameInput"
                    className="form-control inline"
                    onChange={(e) => {setClub({...club, name: e.target.value});
                    }}/>
                <button onClick={updateClub} className="btn">Save</button>
                </>
                }
            </div>
            <div className="col-md-11 club-container">
                <h5>{club.description}</h5>
                {isAdmin &&
                <>
                <label htmlFor="clubDescInput">Change Club Description:</label>
                <input placeholder={club.description} 
                    id="changeDescInput"
                    className="form-control inline"
                    onChange={(e) => {setClub({...club, description: e.target.value})}}/>
                <button onClick={updateClub} className="btn">Save</button>
                </>}
            </div>
        </div>
    );
}