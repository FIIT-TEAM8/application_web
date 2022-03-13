import { useEffect, useState } from "react";
import { UserContext } from "../Utils/UserContext";


export default function UserProvider({children}) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});


    const getCurrentUser = (accessToken) => {
        // get user from server
        if (accessToken  === "awesomeAccessToken123456789") {
            return {
                name: "Táňa",
            };
        }
    }
   

    const handleAccessTokenChange = () => {
        if (!user.name && accessToken) {
            // localStorage.setItem("access_token", accessToken);
            const user = getCurrentUser(accessToken);
            setUser(user);
        } else if (!accessToken) {
            // Log Out
            // localStorage.removeItem("access_token");
            setUser({});
        }
    }

   
    useEffect(() => {
        handleAccessTokenChange();
    }, [accessToken]);
   

    return (
        <UserContext.Provider value={{ user, accessToken, setAccessToken }}>
            {children}
        </UserContext.Provider>
    );
}