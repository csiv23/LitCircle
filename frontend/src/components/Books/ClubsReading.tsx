import { Book, Club, ObjectId } from "../types";
import * as mongooseClient from "../../mongooseClient"
import { Link } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";

function ClubsReadingList(
{ clubs } : 
{ clubs: Club[] }
) { 
    console.log("rendered");
    return (<div className="">
    {clubs.map((club: Club) => {
        if (club) {
            return (
                <div key={club._id} className="club">
                    <Link to={`/bookclub/${club._id}`}>
                        <div>
                            {(club.imageUrl && club.imageUrl !== "") ? 
                            <img src={club.imageUrl} alt={club.name} className="club-cover" /> 
                            : <img src={require("../../images/BookclubDefault.jpeg")} alt={club.name} />}
                        </div>
                        <h5>{club.name}</h5>
                        <p>{club.description}</p>
                    </Link>
                </div>
            );
        } else {
            return (
                <div key={club}>
                    <p>Club with ID {club} not found.</p>
                </div>
            );
        }
    })}
</div>)
}

export default ClubsReadingList;
