import { Club, ObjectId, User } from "../types";
import * as mongooseClient from "../../mongooseClient"
import { Link } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";

function ClubMembersList(
{ members } : 
{ members: User[] }
) {

    return (<div className="d-flex flex-wrap">
    {members.map((user: User) => {
        if (user) {
            return (
                <div key={user._id} className="member">
                    <Link to={`/profile/${user._id}`}>
                        {(user.avatar && user.avatar !== "") ? 
                        <img src={user.avatar} alt={user.avatar}/> 
                        : <img src={require("../images/avatar.jpeg")} alt={user.avatar} />}
                        <p>{user.username}</p>
                    </Link>
                </div>
            );
        } else {
            return (
                <div key={user}>
                    <p>User with ID {user} not found.</p>
                </div>
            );
        }
    })}
</div>)
}

export default ClubMembersList;
