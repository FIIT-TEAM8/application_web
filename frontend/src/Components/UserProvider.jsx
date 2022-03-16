import { useEffect, useState } from "react";
import { UserContext } from "../Utils/UserContext";


export default function UserProvider({children}) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});


    const login = (loginData) => {
        // get user data and access token from server
        // let result = clientLogin(loginData)
        // if result.ok ... return true
        // else return false
        console.log(loginData.username);
        console.log(loginData.password);
        const token = "awesomeAccessToken123456789";
        const user = {"username": "xpolakovat", "name": "Táňa", "surname": "Poláková"};
        setAccessToken(token);
        setUser(user);
        return true
    }
    

    const logout = () => {
        setAccessToken(null);
        setUser({});
    }
    

    return (
        <UserContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}