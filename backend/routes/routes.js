const express = require('express')
const router = express.Router()

const data = require('./endpoints/data')

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "V1 route is working"})
})

//Define base routes here
router.use('/data', data)

module.exports = router