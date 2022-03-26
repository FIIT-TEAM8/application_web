const pg = require('pg')
const { db_cfg } = require('../config')
const Moment = require('moment')
const { request } = require('express')
const { errLog, infoLog } = require('../utils/logging')

/*  Use for transactions:

const db = require(db/postgres)

;(async () => {
    const client = await db.connect()
    try {
        await client.query('BEGIN')
        const query = {
            text: `SELECT * FROM user WHERE username = $1`,
            values: ["tester"]
        }
        await client.query(query)
        ...
        more queries
        ...
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
    } finally {
        client.release()
    }
}
*/

/* Use for simple queries

const query = {
    text: `SELECT * FROM user WHERE username = $1`,
    values: ["tester"]
}
await db.query(query)

*/


// ================== Node postgres date fix - start
// https://github.com/brianc/node-postgres/issues/818


const parseDate = function (value) {
    return value === null ? null : Moment(value)
}

const types = pg.types
const DATATYPE_DATE =  1082
types.setTypeParser(DATATYPE_DATE, function (value) {
    return value
})

// ================== Node postgres date fix - end

let pool = null

createPool = async () => {
    infoLog("Connecting to a PostgreSQL database.")
    let connectionTries = 30
    while (connectionTries) {
        infoLog(`Tries left: ${connectionTries}`)
        try {
            pool = new pg.Pool({
                user: db_cfg.POSTGRES_USER,
                host: db_cfg.POSTGRES_HOST,
                database: db_cfg.POSTGRES_DB,
                password: db_cfg.POSTGRES_PASSWORD,
                port: db_cfg.POSTGRES_PORT,
            })
        } catch (err) {
            // errLog(err)
            errLog(err)
        }
        if (pool) {
            break
        } else {
            // wait 5 seconds
            await new Promise(res => setTimeout(res, 5000)).catch(e => {})
            connectionTries -= 1
        }
        
    }
    infoLog("Moving on.")
}

const getPool = async () => {
    if (pool) {
        return pool
    } else {
        await createPool()
        return pool
    }
}

module.exports = {

    getPool: getPool,

    query: async (args) => {
        const connection = await getPool()
        return await connection.query(args)
    },

    connect: async () => {
        const connection = await getPool()
        return await connection.connect()
    },
}