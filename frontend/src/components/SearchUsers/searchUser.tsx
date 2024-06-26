import { useEffect, useState } from "react";
import { User } from "../types";
import '../../index.css';

export default function UserSearch(
    {
        users,
        renderUsers,
        searchUsers,
    } :
    {
        users: User[],
        renderUsers: (users : User[]) => JSX.Element,
        searchUsers: (userQuery : string) => Promise<any>
    }
) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState(users);


    const fullTextSearch = async (text="") => {
        console.log("search triggered")
        setSearch(text);

        if (text !== "") {
         const results = await searchUsers(text);
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
        console.log(users.length);
     }, [results]);
    
     return (
    <div>
        <div>
            <h4>Members </h4>
            <p>{users.length} Members</p>
        </div>
      <input type="text" value={search}
        onChange={(e) =>
            setSearch(e.target.value)}/>
      <button className="btn"
        onClick={() => fullTextSearch(search)}>
        Search
      </button>
      <button className="btn"
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