import { useEffect, useState } from "react";
import { User } from "../types";

export default function UserSearch(
    {
        users,
        renderUsers,
    } :
    {
        users: User[],
        renderUsers: (users : User[]) => JSX.Element
    }
) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState(users);
    console.log(users);

    const searchUsers = (userQuery : string) : User[] => {
        if (users && users.length > 0) {
            return users.filter((user : User) => {
                return user.username.toLowerCase().startsWith(userQuery.toLowerCase());
            })
        }

        return users;
    }

    const fullTextSearch = async (text="") => {
        setSearch(text);

        if (text !== "") {
         const results = searchUsers(text);
         setResults(results);
         console.log(results);
        }
        else {
            setResults(users);
        }
    };

    useEffect(() => {
        fullTextSearch(search);
        console.log("rerendered");
     }, []);
    
     return (
    <div>
        <div>
            <h4>Members </h4>
            <p>{users.length} Members</p>
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
        results.length > 0) ? renderUsers(results) : renderUsers(users)}
      </div>

    </div>
    )
}