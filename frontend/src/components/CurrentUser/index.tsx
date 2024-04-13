import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../firebase";

export default function CurrentUser({ children }: { children: any }) {
    const dispatch = useDispatch();
    useEffect(() => {
        // onAuthStateChanged is always listening for changes in authentication state
        // SO, authUser will always be up to date and you can just access information
        // about the current user via authUser
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                // Set the current user
                dispatch(setCurrentUser(user.uid));
            }
            else {
                // Set current user to null
                dispatch(setCurrentUser(null));
            }
        });
        // Cleanup function
        return () => unsubscribe();
    }, [])
    return children;
}
