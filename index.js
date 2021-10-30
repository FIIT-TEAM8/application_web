const { response } = require('express')
const express = require('express')
const app = express()

app.get('/', (request, response) => {
    response.send("<h1>Hello from node</h1>")
})

app.listen(process.env.PORT || 3000, () => console.log("App available on 127.0.0.1:3000"))