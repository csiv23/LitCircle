import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../reducers/usersReducer";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../firebase";
import axios from "axios";
import * as client from "../../client";

export default function CurrentUser({ children }: { children: any }) {
    const dispatch = useDispatch();
    useEffect(() => {
        fetchCurrentUser();
    }, []);
    
    const fetchCurrentUser = async () => {
        try {
            const currentUser = await client.profile();
            console.log("CurrentUser before dispatch: " + JSON.stringify(currentUser));
            dispatch(setCurrentUser(currentUser));
        }
        catch (error) {
            dispatch(setCurrentUser(null));
        }
    }

    return children;
}
