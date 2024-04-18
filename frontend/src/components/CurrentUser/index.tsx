import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../firebase";
import axios from "axios";

export default function CurrentUser({ children }: { children: any }) {
    const USERS_API = "http://localhost:4000/api/users";
    const dispatch = useDispatch();
    useEffect(() => {
        // onAuthStateChanged is always listening for changes in authentication state
        // SO, authUser will always be up to date and you can just access information
        // about the current user via authUser
        const unsubscribe = onAuthStateChanged(firebaseAuth, async user => {
            if (user) {
                // Set the currentUser from MongoDB
                const response = await axios.post(`${USERS_API}/getByEmail`, { Email: user.email }); // const response = await axios.get(`${USERS_API}/661fdda08057d32f04114016`);
                console.log(`RESPONSE: ${JSON.stringify(response.data)}`);
                dispatch(setCurrentUser(response.data));
            }
            else {
                // Set current user to null
                console.log("CurrentUser onAuthStateChanged. No User found");
                dispatch(setCurrentUser(null));
            }
        });
        // Cleanup function
        return () => unsubscribe();
    }, [])
    return children;
}
