const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const path = require('path')

const routes = require('./routes/routes')
const {cfg} = require("./config");

const app = express()
app.use(compression())

if (process.env.NODE_ENV !== 'DEV') {
    console.log("Running a DEVELOPMENT server")
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
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
app.use(express.static(path.resolve(cfg.BUILD_PATH)))

//Define version routes here
app.use('/api/', routes)

// Setup for react router
app.get('*', function (req, res) {
    res.status(200).sendFile(path.resolve(`${cfg.BUILD_PATH}/index.html`))
})

app.listen(cfg.APP_PORT, () => console.log(`Listening on port ${cfg.APP_PORT}`))
