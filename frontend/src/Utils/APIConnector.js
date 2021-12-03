// Example POST method implementation:
import Cookies from 'js-cookie'
const DEV = process.env.NODE_ENV !== 'production'

let MODE = 'same-origin'
let CREDENTIALS = 'same-origin'

if (DEV){
    MODE = 'cors'
    CREDENTIALS = 'include'
}

export async function apiCall(endpoint = '', method = 'GET', data = null, ) {
    let baseUrl = ''
    let baseEndpoint = process.env.PUBLIC_URL
    // DEV ENVIRONMENT
    if (DEV) {
        baseUrl = 'http://localhost:8080'
        baseEndpoint = ''
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
    if (response.status === 403 || response.status === 401) {
        const refreshed = await refreshToken()
        if (refreshed) {
            response = await fetch(url, init);
        }
    }
    //if (DEV) console.log(response)
    let result = {}
    try {
        result = response ? response.json() : {}
    } catch (e) {
        result = {ok: false, msg: "Invalid return value"}
    }
    return result; // parses JSON response into native JavaScript objects
}

export async function refreshToken() {
    const response = await fetch('/token', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: MODE, // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: CREDENTIALS, // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    if (response.status === 403 || response.status === 401) {
        window.location.replace(`/login`);
        return false
    } else {
        return true
    }
}

export async function clientLogin(loginData) {
    let result = {}
    await apiCall('/login', {name: loginData.name, password: loginData.password}).then(
        (res) => {
            result = res
        },
        (err) => {
            console.log(err)
        }
    )
    return result
}

//https://medium.com/@SilentHackz/simple-way-to-secure-react-apps-using-jwt-and-react-router-2b4a05d780a3
export function getSession() {
    const jwt = Cookies.get('__refToken')
    let session
    try {
        if (jwt) {
            const base64Url = jwt.split('.')[1]
            const base64 = base64Url.replace('-', '+').replace('_', '/')
            session = JSON.parse(window.atob(base64))
        }
    } catch (e) {
        console.log(e)
    }
    return session
}

export const logOut = async () => {
    await fetch('/logout', {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: MODE, // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: CREDENTIALS, // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    Cookies.remove('__authToken')
    Cookies.remove('__refToken')
    window.location.replace(`/login`);
}