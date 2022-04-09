import { useState } from "react";
import { UserContext } from "../Utils/UserContext";
import { apiCall } from "../Utils/APIConnector";


export default function UserProvider({children}) {
    //const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});


    const login = async (loginData) => {
        apiCall(`/api/user/login`, "POST", loginData).then((result) => {
			console.log(result);
            if (result.ok) {
                const user = {"username": loginData.username};
                setUser(user);
                return true
			} else {
                return false
            }
		});
    }
    

    const logout = async () => {
        apiCall(`/api/user/logout`, "POST").then((result) => {
			console.log(result);
            if (result.ok) {
				setUser({});
			}
		});
        setUser({});
    }
    

    const signup = async (signupData) => {
        apiCall(`/api/user/signup`, "POST", signupData).then((result) => {
			if (result.ok) {
				console.log(result);
                const user = {"username": signupData.username};
                setUser(user);
                return true
			} else {
                return false
            }
		});
    }


    return (
        <UserContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </UserContext.Provider>
    );
}