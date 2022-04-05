import { useState } from "react";
import { UserContext } from "../Utils/UserContext";


export default function UserProvider({children}) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});
    const [articlesInReport, setArticlesInReport] = useState([])


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
    
    // TODO: make request to backend for adding article to PDF report
    // make alerts for adding article
    // make page for pdf report
    const addArticleReport = (article) => {
        // add article to array of all articles in PDF report
        setArticlesInReport((prevState) => {
            prevState.push(article);
            return prevState;
        });

        console.log(articlesInReport); // remove
        apiCall(`/api/data/search/?q=${searchParams.get("q")}&page=${searchParams.get("page")}`, "GET").then((result) => {
			if (result.ok) {
				setActResults(result.data.results);
				setTotalPages(result.data.total_pages);
				setTotalResults(result.data.total_results);
				setIsLoaded(true);
			}
		});
    };

    // TODO: make request to backend for removing article from PDF report
    const removeArcticleReport = (articleId) => {
        // remove article by id from articles in PDF report
        setArticlesInReport((prevState) => {
            const articleIndex = prevState.findIndex(article => {
                return article.id === articleId;
            });
            
            // make sure array contains articleId
            if (articleIndex !== -1) {
                prevState.splice(articleIndex, 1);
            }

            return prevState;
        });

        console.log(articlesInReport); // remove
    }
    

    return (
        <UserContext.Provider value={{ user, accessToken, articlesInReport, login, logout, addArticleReport, removeArcticleReport }}>
            {children}
        </UserContext.Provider>
    );
}