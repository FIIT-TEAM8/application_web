import { useState } from "react";
import { UserContext } from "../Utils/UserContext";


export default function UserProvider({children}) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});
    const [articlesInPDFReport, setArticlesInPDFReport] = useState([])


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

    const addArticlePDFReport = (articleId) => {
        // add new item to articlesInPDFReport array
        setArticlesInPDFReport((prevState) => {
            prevState.push(articleId);
            console.log(prevState);
            return prevState;
        });
    };

    const removeArcticlePDFReport = (articleId) => {
        // remove item from articlesInPDFReport array
        setArticlesInPDFReport((prevState) => {
            let articleIndex = prevState.indexOf(articleId);
            
            // make sure array contains articleId
            if (articleIndex !== -1) {
                prevState.splice(articleIndex, 1);
            }

            console.log(prevState);
            return prevState;
        });
    }
    

    return (
        <UserContext.Provider value={{ user, accessToken, articlesInPDFReport, login, logout, addArticlePDFReport, removeArcticlePDFReport }}>
            {children}
        </UserContext.Provider>
    );
}