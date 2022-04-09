import { useState } from "react";
import { UserContext } from "../Utils/UserContext";
import { apiCall } from "../Utils/APIConnector";


export default function UserProvider({children}) {
    //const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});


    const login = async (loginData) => {
        let isLogged = await apiCall(`/api/user/login`, "POST", loginData).then((result) => {
            if (result.ok) {
                return true
			} else {
                return false
            }
		});

        if (isLogged){
            setUser({"username": loginData.username});
            return true;
        } else {
            return false;
        }
    }
    

    const logout = () => {
        apiCall(`/api/user/logout`, "POST").then((result) => {
            console.log(result);
            if (result.ok) {
				setUser({});
			}
		}).catch(err => console.log(err));
    }
    

    const signup = async (signupData) => {
        let isSignedup = await apiCall(`/api/user/signup`, "POST", signupData).then((result) => {
            if (result.ok) {
                return true
			} else {
                return false
            }
		});

        if (isSignedup){
            setUser({"username": signupData.username});
            return true;
        } else {
            return false;
        }
    }


    return (
        <UserContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </UserContext.Provider>
    );
}