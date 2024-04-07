import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase";
import { useEffect, useState } from "react";

const AuthDetails = async () => {
    const [authUser, setAuthUser] = useState({});
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                setAuthUser(user);
                console.log("Signed in! uid: " + user.uid);
            }
            else {
                console.log("Not signed in")
            }
        })
    }, [])

    return (
        <div>
            {/* {authUser ? (

            ) : (

            )} */}
        </div>
    )
}

export default AuthDetails;