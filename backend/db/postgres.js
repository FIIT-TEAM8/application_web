const pg = require('pg')
const { db_cfg } = require('../config')
const Moment = require('moment')

/*  Use for transactions:

const db = require(db/postgres)

;(async () => {
    const client = await db.connect()
    try {
        const client = await db.connect()
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

/* Use for simple queroes

*/


// ================== Node postgres date fix - start
// https://github.com/brianc/node-postgres/issues/818

const { request } = require('express')
const parseDate = function (value) {
    return value === null ? null : Moment(value)
}

const types = pg.types
const DATATYPE_DATE =  1082
types.setTypeParser(DATATYPE_DATE, function (value) {
    return value
})

// ================== Node postgres date fix - end

const Pool = pg.Pool

const pool = new Pool({
    user: db_cfg.POSTGRES_USER,
    host: db_cfg.POSTGRES_HOST,
    database: db_cfg.POSTGRES_DB,
    password: db_cfg.POSTGRES_PASSWORD,
    port: db_cfg.POSTGRES_PORT,
})

module.exports = pool