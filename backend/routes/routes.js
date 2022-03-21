const express = require('express')
const router = express.Router()

const dataRoute = require('./endpoints/data')
const userRoute = require('./endpoints/user')

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Default api route. Ok."})
})

//Define base routes here
router.use('/data', dataRoute)
router.use('/user', userRoute)

module.exports = router