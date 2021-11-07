const express = require('express')
const app = express()

const APP_PORT = process.env.PORT || 8080

app.get('/', (request, response) => {
    response.send("<h1>Hello from node</h1>")
})

app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))