// '/archive/*' endpoint

const express = require('express')
const fetch = require('node-fetch')
const {cfg} = require("../../config");
const { debug } = require('../../utils/logging');
const router = express.Router()

const testData = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit sollicitudin viverra. Pellentesque ut metus tempus, luctus quam pulvinar, viverra turpis. Proin venenatis sem a urna eleifend fringilla. Quisque non felis vel ligula faucibus viverra non quis urna. Donec mi nulla, tempus nec suscipit convallis, bibendum sed sem. Sed dapibus dolor enim, vitae varius turpis placerat ac. Proin at varius urna. Donec accumsan risus vitae turpis maximus tincidunt. Nunc est erat, porta eget nisi nec, molestie placerat sapien. Aenean vehicula congue urna, nec ullamcorper purus dapibus at."
const testDataURL = "Morbi aliquet maximus lacus eu ornare. Aenean suscipit sem quis lorem tempus vestibulum. Morbi ac ullamcorper ante, a bibendum ipsum. Nam bibendum, lectus at tempor rhoncus, justo tortor malesuada mauris, in tristique felis nibh non ligula. Nunc id maximus ex. Donec elementum iaculis nisl, vel laoreet mi scelerisque sed. Sed tincidunt lacinia blandit. Ut leo nisl, mollis sit amet metus a, scelerisque maximus velit. In risus metus, scelerisque at porta in, congue non nisi. Duis ac massa ut sem bibendum pellentesque sollicitudin in nunc. Donec gravida sollicitudin lobortis."

router.get('/', function (req, res) {
    res.status(200).json({ok: true, data: {}, msg: "Archive route is working"})
})

// node_host /ams/api/data/search/
router.get('/search/', async function (req, res){
    try {
        
        const url = req.query['url']
        const id = req.query['id']

        await new Promise(res => setTimeout(res, 2000)).catch(e => {})
        debug(`URL: ${url} ID: ${id}`)

        let data = ""
        if (id && id !== "null") {
            data = testData
            // const data = await apiFetch("archive/", req)
        } else if (url && url !== "null") {
            data = testDataURL
        } else {
            return res.status(400).json({ok: false, msg: "No search parameters provided."})
        }

        return res.status(200).json({ok: true, msg: "Data sent.", data: data})
    } catch (e) {
        console.log(e);
        console.log('Exception happened while handling: /archive/search')
        return res.status(500).json({ok: false, msg: "Something went wrong while forwarding the request"})
    }
})

module.exports = router