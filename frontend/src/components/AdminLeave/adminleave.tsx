import { Club, ObjectId, User } from "../types";
import * as mongooseClient from "../../mongooseClient"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode} from "react";
import UserSearch from "../SearchUsers/searchUser";


function AdminLeave({appointAsOrganizer} : {appointAsOrganizer : (userId : string) => Promise<void>}) 
{   
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([] as User[]);

    const {clubId} = useParams();
    const [club, setClub] = useState<Club>({
      _id: "",
      name: "",
      description: "",
      members: [],
      booksRead: [],
      wishlist: [],
      currentBook: "",
      nextMeeting: {
        meetingDate: new Date(),
        location: ""
      },
      organizer: "",
      imageUrl: ""
    });
    const [currentUser, setCurrentUser] = useState<User>(
      {
          _id: "",
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          followers: [],
          following: [],
          wishlist: [],
          booksRead: [],
          bookClubs: [],
          avatar: "",
      }
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [clubMembers, setClubMembers] = useState([] as User[]);


    const renderUser = (user : User) => {
        return (
            <div key={user._id} className="member">
                <Link to={`/profile/${user._id}`}>
                    {(user.avatar && user.avatar !== "") ? 
                    <img src={user.avatar} alt={user.avatar}/> 
                    : <img src={require("../images/avatar.jpeg")} alt={user.avatar} />}
                    { club.organizer && club.organizer === user._id &&
                        <h4>Club Admin</h4>
                    }  
               
                    <p>{user.username}</p>
                    </Link>
                        <button onClick={() => {appointAsOrganizer(user._id)}}>
                            Promote
                        </button>
                
            </div>
        );
    }

    const renderUsers = (users : User[]) => {
        const restMembers = users.filter(user => user._id !== currentUser._id && user._id !== club.organizer);
        
        return (
            <div>
                {restMembers && restMembers.map(renderUser)}
            </div>
            
        ) 
    }

    const searchUsers = async (userQuery : string) => {
        if (clubId) {
  
          if (clubMembers && clubMembers.length > 0) {
              return clubMembers.filter((user : User) => {
                  return user.username.toLowerCase().startsWith(userQuery.toLowerCase());
              })
          }
        }
        return [] as User[]
       
      }

    const fullTextSearch = async (text="") => {
        if (text !== "") {
            const results = await searchUsers(text);
            setResults(results);
            console.log(results);
           }
           else {
             setResults(clubMembers);
           }
    };

    const setup = async () => {
        if (clubId) {
          const userSession = await mongooseClient.profile();
          setCurrentUser(userSession);
  
          if (userSession) {
              const currentClub = await mongooseClient.getBookClubById(clubId);
              setClub(currentClub);
              console.log(currentClub)
  
              const newMembers = await mongooseClient.getMembersByClub(clubId);
              setClubMembers(newMembers);
  
              const userIsAdmin = currentClub.organizer === userSession._id
              setIsAdmin(userIsAdmin)
              console.log("user is admin: " + userIsAdmin);

              if (!userIsAdmin) {
                navigate(`/bookclub/${clubId}/`)
              }
          }
          else {
              navigate("/login");
          };
        }
      }


      useEffect(() => {
        setup();
      }, []);
      useEffect(() => {
        console.log("rerender");
        fullTextSearch(search);
     }, [search]);

    return (
    <div className="d-flex flex-wrap">
    <div>
    {(club.imageUrl && club.imageUrl !== "") ? 
                <img src={club.imageUrl} alt={club.imageUrl} className="book-cover" /> 
                : <img src={require("../../images/BookclubDefault.jpeg")} alt={club.name} />}
    </div>
    <div>
    <div>
        <div>
            <h4>Select New Organizer:  </h4>
            <p>{clubMembers.length} Members</p>
        </div>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      <button
        onClick={() => fullTextSearch(search)}>
        Search
      </button>
      <button
        onClick={() => fullTextSearch("")}>
        Refresh
      </button>
      <div>
      {(results &&
        (results.length > 0 || search !=="")) ? renderUsers(results) : renderUsers(clubMembers)}
      </div>

    </div>
    </div>

    
    </div>
    )
}

export default AdminLeave;
