APP_PORT = process.env.PORT || 8080
IS_HTTPS = true
COOKIE_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days
BUILD_PATH = '../frontend/build'
API_HOST = 'http://flask_server:5000'

if (process.env.DEV) {
    API_HOST = 'https://team08-21.studenti.fiit.stuba.sk/api/'
    IS_HTTPS = false
}

const cfg = {
    APP_PORT,
    IS_HTTPS,
    COOKIE_AGE,
    BUILD_PATH,
    API_HOST,
}

module.exports = {
    cfg,
}