import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { apiCall, getCookieToken, refreshToken } from "./APIConnector";
import { UserContext } from "./UserContext";

export default function UserProvider({ children }) {
    //const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    // user = {username: "", }
    const [user, setUser] = useState(undefined);
    const [articlesInReport, setArticlesInReport] = useState([]);
    const [reportId, setReportId] = useState(0);

    useEffect(() => {
        refresh();
    }, []);

    useEffect(async () => {
        if (user !== undefined) {
            await apiCall(`/api/pdf_report/${user.id}?status=In Progress`, "GET")
                .then((result) => {
                    // TODO: info user, that PDF report wasn't loaded
                    if (result.ok) {
                        setReportId(result.reportId);
                    }
                });
        }
    }, user);

    // update or create user's 'In Progress' report, when articlesInReport array is updated
    useEffect(() => {
        if (reportId !== 0) {
            // update user's in progress report
            updateReportAPI();
        } else if (user && typeof(user.id) === "number") {
            // create new user's 'In progress' report
            apiCall(`/api/pdf_report/create`, "POST", {
                userId: user.id,
                articlesInReport: articlesInReport,
            }).then((result) => {
                // TODO: info user, that PDF wasn't created
                if (result.ok) {
                    setReportId(result.reportId);
                    console.log("PDF successfully created");
                }
            });
        }
    }, articlesInReport);

    const refresh = async () => {
        const loginRefToken = getCookieToken("__refToken");
        if (!loginRefToken) {
            setUser(undefined);
            return;
        }

        setUser({
            username: loginRefToken.username,
            id: loginRefToken.id,
        });

        await refreshToken().then((ok) => {
            if (!ok) {
                setUser(undefined);
            }
        });
        console.log("Logged in via refToken");
    };

    const login = async (loginData) => {
        let isLogged = await apiCall(`/api/user/login`, "POST", loginData).then((result) => {
            if (result.ok) {
                return true;
            } else {
                return false;
            }
        });

        if (isLogged) {
            // setUser({ username: loginData.username });
            await refresh();
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        apiCall(`/api/user/logout`, "POST")
            .then((result) => {
                if (result.ok) {
                    setUser(undefined);
                }
            })
            .catch((err) => console.log(err));
        Cookies.remove("__authToken");
        Cookies.remove("__refToken");
    };

    const updateReportAPI = () => {
        apiCall(`/api/pdf_report/update/${reportId}`, "POST", {
            articlesInReport: articlesInReport,
        })
            .then((result) => {
                if (result.ok) {
                    console.log("Updated articles in PDF report");
                } else {
                    console.log("Unable to update PDF report.");
                }
            })
            .catch((err) => console.log(err));
    };

    const addArticleReport = (article) => {
        // add article to array of all articles in PDF report
        setArticlesInReport((prevState) => {
            prevState.push(article);
            return prevState;
        });
    };

    const removeArcticleReport = (articleId) => {
        // remove article by id from articles in PDF report
        setArticlesInReport((prevState) => {
            const articleIndex = prevState.findIndex((article) => {
                return article.id === articleId;
            });

            // make sure array contains articleId
            if (articleIndex !== -1) {
                prevState.splice(articleIndex, 1);
            }

            return prevState;
        });
    };

    const signup = async (signupData) => {
        let isSignedup = await apiCall(`/api/user/signup`, "POST", signupData).then((result) => {
            if (result.ok) {
                return true;
            } else {
                return false;
            }
        });

        if (isSignedup) {
            // setUser({ username: signupData.username });
            await refresh();
            return true;
        } else {
            return false;
        }
    };

    return (
        <UserContext.Provider
            // @ts-ignore
            value={{
                user,
                login,
                logout,
                signup,
                articlesInReport,
                addArticleReport,
                removeArcticleReport,
            }}>
            {children}
        </UserContext.Provider>
    );
}
