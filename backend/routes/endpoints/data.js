// '/tests/*' endpoint

const express = require('express')
const fetch = require('node-fetch')
const {cfg} = require("../../config");
const router = express.Router()

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Data route is working"})
})

function extractQueryString(req) {
    const query = req.query
    return  Object.keys(query)
        .map(key => `?${key}=${query[key]}`)
        .join('')
}

async function apiFetch(endpoint, req) {
    const version = req.query.version || cfg.DATA_API_VERSION
    const url = `${cfg.DATA_API_HOST}/${version}/${endpoint}${extractQueryString(req)}`
    const response = await fetch(url)
    return await response.json()
}

// node_host /ams/api/data/search/
router.get('/search/', async function (req, res){
    try {
        const data = await apiFetch("search/", req)

        return res.status(200).json({ok: true, data: data})
    } catch (e) {
        console.log(e);
        console.log('Exception happened while handling: /search')
        return res.status(500).json({ok: false, msg: "Something went wrong while forwarding the request"})
    }
})

module.exports = router