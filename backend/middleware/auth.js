const { debug } = require("../utils/logging")
const jwt = require('jsonwebtoken');
const { getUser } = require("../db/user_db");
const { differenceInBusinessDays } = require("date-fns");
const { checkRefreshToken } = require("../db/token_db");
const { cfg } = require("../config");

// https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified auth
function generateAccessToken(data) {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

function authenticateUser(req, res, next) {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    const token = req.cookies.__authToken;
    if (! token) {
        return res.sendStatus(401)
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        debug(`Authenticated: ${user.username}`)
        req.body.user = user
        next()
    })
}

// If a user is logged in, the data will be in req.body.user
function attachUser(req, res, next) {
    const token = req.cookies.__authToken;
    if (! token) {
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return refreshToken(req, res, next)
        }
        debug(`Authenticated: ${user.username}`);
        const dbuser = await getUser(user.username);
        delete dbuser.password;
        req.body.user = dbuser;
        next();
    })
}

async function refreshToken(req, res, next) {
    const refreshToken = req.cookies.__refToken

    if (! refreshToken) {
        return res.sendStatus(401)
    }
    
    const refreshTokenMaxAge = await checkRefreshToken(refreshToken)
    if (! refreshTokenMaxAge) {
        return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403)

        const accessToken = generateAccessToken({username: user.username, id: user.id})
        // @ts-ignore
        res.cookie('__authToken', accessToken, {maxAge: cfg.AUTH_COOKIE_AGE, httpOnly: true, secure: cfg.IS_HTTPS})
        // @ts-ignore
        res.cookie('__refToken', refreshToken, {maxAge: refreshTokenMaxAge * 1000, httpOnly: false, secure: cfg.IS_HTTPS})

        debug(`Authenticated: ${user.username}`);
        const dbuser = await getUser(user.username);
        delete dbuser.password;
        req.body.user = dbuser;

        next();
    });
}

module.exports = {
    authenticateUser,
    attachUser,
    generateAccessToken,
    refreshToken,
}