require('dotenv').config()

const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')


APP_PORT = process.env.PORT || 8080
IS_HTTPS = true
COOKIE_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days
BUILD_PATH = '../frontend/build'

const app = express()
app.use(compression())

if (process.env.DEV) {
    console.log("Running a DEVELOPMENT server")
    IS_HTTPS = false
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.setHeader('Access-Control-Allow-Credentials', 1)
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-Width, Content-Type, Accept, Authorization')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT')
        next()
    })
}

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser())

// React build is found here
app.use(express.static(BUILD_PATH))

// Setup for react router
app.get('*', function (req, res) {
    res.status(200).sendFile(`${BUILD_PATH}/index.html`, {root: __dirname})
})

app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))