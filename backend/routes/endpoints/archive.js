// '/archive/*' endpoint

const express = require('express')
const fetch = require('node-fetch')
const {cfg} = require("../../config");
const { debug } = require('../../utils/logging');
const router = express.Router()

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Archive route is working"})
})

function extractQueryString(req) {
    const query = req.query
    return  '?' + Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join('&')
}

async function apiFetch(endpoint, req) {
    const version = req.query.version || cfg.DATA_API_VERSION
    const url = `${cfg.DATA_API_HOST}/${version}/${endpoint}${extractQueryString(req)}`
    // @ts-ignore
    const response = await fetch(url)
    return await response.json()
}

// node_host /ams/api/data/search/
router.get('/search/', async function (req, res){
    try {
        const link = req.query['link']

        let data = {}

        if (link && link !== "null") {
            data = await apiFetch("archive", req)
        } else {
            return res.status(400).json({ok: false, msg: "No search parameters provided."})
        }

        return res.status(200).json({ok: true, msg: "Data sent.", data: data.article})
    } catch (e) {
        console.log(e);
        console.log('Exception happened while handling: /archive/search')
        return res.status(500).json({ok: false, msg: "The requested article could not be found."})
    }
})

module.exports = router