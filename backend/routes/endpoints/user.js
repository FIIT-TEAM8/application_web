// '/user/*' endpoint
const jwt = require('jsonwebtoken')
const express = require('express')
const fetch = require('node-fetch')
const bcrypt = require('bcrypt')
const {cfg} = require("../../config")
const {debug, infoLog, errLog} = require("../../utils/logging")
const userdb = require("../../db/userdb")
const tokendb = require("../../db/tokendb")


const router = express.Router()

// https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified auth
function generateAccessToken(username) {
    return jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Default user route is working"})
})

router.post('/signup', async function(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {username: req.body.username, password: hashedPassword}
        const id = await userdb.insertUser(user)
        if (!id) {
            return res.status(400).json({ok: false, msg: "Sign up failed. Username might already be in use."})
        }
        return res.status(200).json({ok: true, msg: "Sign up successful."})
    } catch (e) {
        errLog(e.stack)
        return res.status(500).json({ok: false, msg: "Internal server error."})
    }
})

router.post('/login', async function(req, res) {
    const user = await userdb.getUser(req.body.username)
    const cookieAge = req.body.maxCookieAge || 60 * 60 * 24 // 1 day default (60s * 60m * 24h)
    debug(`REF_COOKIE_AGE: ${cookieAge}`)
    debug(`AUTH_COOKIE_AGE: ${cfg.AUTH_COOKIE_AGE}`)
    if (!user) {
        return res.status(404).json({ok: false, auth: false, msg: "User does not exist."})
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user.username)
            const refreshToken = jwt.sign({username: user.username}, process.env.REFRESH_TOKEN_SECRET)
            tokendb.insertRefreshToken(refreshToken, cookieAge)

            res.cookie('__authToken', accessToken, {maxAge: cfg.AUTH_COOKIE_AGE, httpOnly: true, secure: cfg.IS_HTTPS})
            res.cookie('__refToken', refreshToken, {maxAge: cookieAge * 1000, httpOnly: false, secure: cfg.IS_HTTPS})
            res.status(200).json({
                ok: true, 
                auth: true, 
                msg: "Logged in.", 
                accessToken: accessToken, 
                refreshToken: refreshToken
            })
        } else {
            res.status(401).json({ok: false, auth: false, msg: "Incorrect password."})
        }
    } catch (e) {
        errLog(e.stack)
        res.status(500).json({ok: false, msg: "Internal server error."})
    }
})

router.get('/token', async function(req, res) {
    const refreshToken = req.cookies.__refToken

    if (! refreshToken) {
        return res.sendStatus(401)
    }
    
    const refreshTokenMaxAge = await tokendb.checkRefreshToken(refreshToken)
    if (! refreshTokenMaxAge) {
        return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        const accessToken = generateAccessToken(user.username)
        res.cookie('__authToken', accessToken, {maxAge: cfg.AUTH_COOKIE_AGE, httpOnly: true, secure: cfg.IS_HTTPS})
        res.cookie('__refToken', refreshToken, {maxAge: refreshTokenMaxAge * 1000, httpOnly: false, secure: cfg.IS_HTTPS})
        res.status(200).json({ok: true, accessToken: accessToken})
    })
})

router.post('/logout', async function(req, res) {
    try {
        await tokendb.deleteRefreshToken(req.cookies.__refToken)
        return res.status(200).json({ok: true, msg: "Log out successful."})
    } catch (e) {
        errLog(e.stack)
        res.status(500).json({ok: false, msg: "Internal server error."})
    }
})

module.exports = router