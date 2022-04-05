import { useState } from "react";
import { apiCall } from "../Utils/APIConnector";
import { UserContext } from "../Utils/UserContext";


export default function UserProvider({children}) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});
    const [articlesInReport, setArticlesInReport] = useState([]);
    const [reportId, setReportId] = useState(0);


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

    const updateReportAPI = () => {
        apiCall(`/api/pdf_report/update/${reportId}`, 'POST', { "articlesInReport": articlesInReport }).then((result) => {
            if (result.ok) {
                console.log('Updated articles in PDF report');
            } else {
                console.log('Unable to update PDF report.');
            }
        }).catch(err => console.log(err));
    }
    
    // TODO: after user login or sign up load his in progress report
    // make alerts for adding article
    // make page for pdf report
    const addArticleReport = (article) => {
        // add article to array of all articles in PDF report
        setArticlesInReport((prevState) => {
            prevState.push(article);
            return prevState;
        });

        console.log(articlesInReport); // remove
        
        // TODO: remove this and on user login/singup load automatically 
        if (reportId !== 0) {
            updateReportAPI();
        } else {
            apiCall(`/api/pdf_report/create`, 'POST', { "userId": 1, "articlesInReport": articlesInReport }) // switch 1 to user_id
                .then(result => {
                    if (result.ok) {
                        setReportId(result.reportId);
                    }
                });
        }
    };

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

        if (reportId !== 0) {
            updateReportAPI();
        }
    }
    

    return (
        <UserContext.Provider value={{ user, accessToken, articlesInReport, login, logout, addArticleReport, removeArcticleReport }}>
            {children}
        </UserContext.Provider>
    );
}