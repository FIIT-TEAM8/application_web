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
    const url = cfg.API_HOST + endpoint + extractQueryString(req)
    const response = await fetch(url)
    return await response.json()
}

router.get('/search/', async function (req, res){
    try {
        const data = await apiFetch("/v1/search/", req)
        res.status(200).json({ok: true, data: data})
    } catch (e) {
        console.log('Exception happend while handling: /search')
    }
})

module.exports = router