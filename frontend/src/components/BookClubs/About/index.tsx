import { Club, User } from "../../types";

export default function About(
    {club, isAdmin, updateClub, setClub} 
    : 
    {
        club : Club,  
        isAdmin : boolean,
        updateClub : () => void,
        setClub : (club : Club) => void;
    }) {
    
    return (
        <div>
            <div className="col-md-11 club-container">
                <h1>About Our Club</h1>
            </div>
            <div className="col-md-11 club-container">
                {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.name} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
                {isAdmin && 
                <><input value={club.imageUrl} className="form-control inline"
                        onChange={(e) => { setClub({ ...club, imageUrl: e.target.value }); } } />
                        <button onClick={updateClub}>Save</button></>}
            </div>
            <div className="col-md-11 club-container">
                <h4>{club.name}</h4>
                {isAdmin &&
                <>
                <input value={club.name} className="form-control inline"
                    onChange={(e) => {setClub({...club, name: e.target.value});
                    }}/>
                <button onClick={updateClub}>Save</button>
                </>
                }
            </div>
            <div className="col-md-11 club-container">
                <p>{club.description}</p>
                {isAdmin &&
                <>
                 <input value={club.description} className="form-control inline"
                    onChange={(e) => {setClub({...club, description: e.target.value})}}/>
                <button onClick={updateClub}>Save</button>
                </>}
            </div>
        </div>
    );
}