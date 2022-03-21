// '/user/*' endpoint

const express = require('express')
const fetch = require('node-fetch')
const {cfg} = require("../../config");
const router = express.Router()

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Default user route is working"})
})

router.post('/login', async function(req, res) {

})

router.post('/logout', async function(req, res) {

})



module.exports = router