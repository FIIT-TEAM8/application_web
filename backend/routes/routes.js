const express = require('express')
const router = express.Router()

const testsRoutes = require('./endpoints/tests')

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "V1 route is working"})
})

//Define base routes here
router.use('/tests', testsRoutes)
router.use('/users', testsRoutes)

module.exports = router