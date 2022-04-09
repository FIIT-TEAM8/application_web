// '/user/*' endpoint
const jwt = require('jsonwebtoken')
const express = require('express')
const fetch = require('node-fetch')
const bcrypt = require('bcrypt')
const {cfg} = require("../../config")
const {debug, infoLog, errLog} = require("../../utils/logging")
const userdb = require("../../db/user_db")
const tokendb = require("../../db/token_db")
const { generateAccessToken, refreshToken } = require('../../middleware/auth')


const router = express.Router()

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
            const accessToken = generateAccessToken({username: user.username, id: user.id})
            const refreshToken = jwt.sign({username: user.username, id: user.id}, process.env.REFRESH_TOKEN_SECRET)
            tokendb.insertRefreshToken(refreshToken, cookieAge)

            // @ts-ignore
            res.cookie('__authToken', accessToken, {maxAge: cfg.AUTH_COOKIE_AGE, httpOnly: true, secure: cfg.IS_HTTPS})
            // @ts-ignore
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

router.get('/token', refreshToken, async function(req, res) {
    res.status(200).json({ok: true})
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