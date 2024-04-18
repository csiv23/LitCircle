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
                    <Link to={`/public-profile/${user._id}`}>
                        {/* <img className="member-profile-picture" 
                            src={require(`../images/${user.avatar}`)} alt={user.username}/> */}
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
