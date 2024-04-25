import { Club, ObjectId, User } from "../../types";
import * as mongooseClient from "../../../mongooseClient"
import { Link } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";
import UserSearch from "../../SearchUsers/searchUser";


function Members(
{ 
    members,
    club,
    currentUser,
    organizer, 
    isAdmin,
    leaveClub,
    removeUser,
    searchUser,
} : 
{ 
    members: User[],
    club: Club,
    currentUser: User, 
    organizer: User
    isAdmin : boolean
    leaveClub: () => void,
    removeUser : (userId:string) => void
    searchUser : (userQuery:string) => Promise<any>
}) 
{   
    const renderUser = (user : User) => {
        return (
            <div key={user._id} className="member">
                <Link to={`/profile/${user._id}`}>
                    {(user.avatar && user.avatar !== "") ? 
                    <img src={user.avatar} alt={user.avatar}/> 
                    : <img src={require("../../images/avatar.jpeg")} alt={user.avatar} />}
                    { organizer && organizer._id && organizer._id === user._id &&
                        <h4>Club Admin</h4>
                    }  
                </Link>
                    <p>{user.username}</p>
                    {/* TODO: ADD ONCLICK FOR FOLLOWING*/}
                    { currentUser && currentUser._id && user._id !== currentUser._id &&
                        <>
                        <button >
                        {
                            (currentUser 
                            && currentUser.following 
                            && currentUser.following.length > 0
                            && currentUser.following.includes(user._id)) 
                            ? "Unfollow"
                            : "Follow"
                        }
                        </button>
                        {isAdmin && <button onClick={() => {removeUser(user._id)}}>
                            Remove 
                        </button>}
                        </>
                    }
                    { currentUser && currentUser._id && user._id === currentUser._id &&
                        <button onClick={leaveClub}>
                            Leave Club
                        </button>
                    }    
                
            </div>
        );
    }

    const renderUsers = (users : User[]) => {
        const currentUserInUsers = users.find(user => user._id === currentUser._id);
        const organizerInUsers = users.find(user => user._id === organizer._id && user._id !== currentUser._id);
        const restMembers = users.filter(user => user._id !== currentUser._id && user._id !== organizer._id);
        
        return (
            <div>
                {currentUserInUsers && renderUser(currentUserInUsers)}
                {organizerInUsers && renderUser(organizerInUsers)}
                {restMembers && restMembers.map(renderUser)}
            </div>
            
        )
    }


    
    return (
    <div className="d-flex flex-wrap">
    <div>
    {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.imageUrl} className="book-cover" /> 
                : <img src={require("../../../images/BookclubDefault.jpeg")} alt={club.name} />}
    </div>
    <div>
        <UserSearch 
            users={members}
            renderUsers={renderUsers}
            searchUsers={searchUser} />
    </div>

    
    </div>
    )
}

export default Members;
