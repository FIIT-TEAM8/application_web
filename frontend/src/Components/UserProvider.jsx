import { useState } from "react";
import { apiCall } from "../Utils/APIConnector";
import { UserContext } from "../Utils/UserContext";
import { apiCall } from "../Utils/APIConnector";


export default function UserProvider({children}) {
    //const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState({});
    const [articlesInReport, setArticlesInReport] = useState([]);
    const [reportId, setReportId] = useState(0);


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
        <UserContext.Provider value={{ user, login, logout, singup, articlesInReport, addArticleReport, removeArcticleReport }}>
            {children}
        </UserContext.Provider>
    );
}