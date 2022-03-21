// '/user/*' endpoint
const jwt = require('jsonwebtoken')
const express = require('express')
const fetch = require('node-fetch')
const {cfg} = require("../../config")
const router = express.Router()

function authenticateToken(req, res, next) {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    const token = req.cookies.__authToken
    if (! token) {
        return res.sendStatus(401)
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        debug(`Authenticated: ${user.name}`)
        req.user = user
        next()
    })
}

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Default user route is working"})
})

router.post('/login', async function(req, res) {

})

router.post('/logout', async function(req, res) {

})



module.exports = router