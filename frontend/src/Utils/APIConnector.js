// @ts-nocheck
// Example POST method implementation:
import Cookies from 'js-cookie'
const DEV = process.env.NODE_ENV !== 'production'

let MODE = 'same-origin'
let CREDENTIALS = 'same-origin'

if (DEV){
    MODE = 'cors'
    CREDENTIALS = 'include'
}

export async function apiCall(endpoint = '', method = 'GET', data = null, ignoreAuthError=false) {
    let baseUrl = ''
    let baseEndpoint = process.env.PUBLIC_URL
    // DEV ENVIRONMENT
    if (DEV) {
        baseUrl = `http://localhost:${process.env.REACT_APP_PORT}`
        // baseEndpoint = ''
    }

    const url = baseUrl + baseEndpoint + endpoint
    let response = {}

    // Default options are marked with *
    const init = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: MODE, // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: CREDENTIALS, // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
    }

    if (data) {
        init.body = JSON.stringify(data)
    }

    await fetch(url, init).then(
        (res) => {
            response = res;
        },
        (error) => {
            console.log(error)
        }
    );

    if ((response.status === 403 || response.status === 401) && !ignoreAuthError) {
        const refreshed = await refreshToken()
        if (refreshed) {
            response = await fetch(url, init).then(
                (res) => {
                    response = res;
                },
                (error) => {
                    console.log(error)
                }
            );
        }
    }
    //if (DEV) console.log(response)
    let result = {}
    try {
        if (response) {
            result = await response.json();
        }
    } catch (e) {
        console.error("Response not in json format.");
        result = {ok: false, msg: "Invalid return value"}
    }
    result.status = response.status;
    return result; // parses JSON response into native JavaScript objects
}

export async function refreshToken() {
    const response = await apiCall('/api/user/token', 'GET', undefined, true)
    if (response.status === 403 || response.status === 401) {
        Cookies.remove("__authToken");
        Cookies.remove("__refToken");
        return false;
    } else {
        return true;
    }
}

//https://medium.com/@SilentHackz/simple-way-to-secure-react-apps-using-jwt-and-react-router-2b4a05d780a3
export function getCookieToken(cookieName='__refToken') {
    const jwt = Cookies.get(cookieName);
    let session;
    try {
        if (jwt) {
            const base64Url = jwt.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            session = JSON.parse(window.atob(base64));
        }
    } catch (e) {
        console.log(e);
    }
    return session;
}

// export const logOut = async () => {
//     await fetch('/logout', {
//         method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
//         mode: MODE, // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: CREDENTIALS, // include, *same-origin, omit
//         headers: {
//             'Content-Type': 'application/json'
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         redirect: 'follow', // manual, *follow, error
//         referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     });
//     Cookies.remove('__authToken')
//     Cookies.remove('__refToken')
//     window.location.replace(`/login`);
// }