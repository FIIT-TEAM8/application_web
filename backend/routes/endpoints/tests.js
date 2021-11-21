// '/tests/*' endpoint

const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Test route is working"})
})

module.exports = router