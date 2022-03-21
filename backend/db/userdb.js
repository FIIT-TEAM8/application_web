const { el } = require("date-fns/locale");
const db = require("./postgres")

async function getUser(username) {
    const query = {
        text: `SELECT * FROM user WHERE usernamename = $1`, 
        values: [username]
    }
    const result = await db.query(query);
    if (result.rows && result.rows[0]) {
        return result.rows[0]
    } else {
        return null
    }
}

async function insertUser(user) {
    const query = {
        text: `INSERT INTO user (username, password) VALUES ($1, $2) RETURNING id`,
        values: [user.username, user.password]
    }
    const result = await db.query(query);
    if (result.rows && result.rows[0]) {
        return result.rows[0].id
    } else {
        return null
    }
}

async function checkRefreshToken(token) {
    const query = {
        text: `UPDATE refresh_token SET last_access = now() WHERE token = $1 RETURNING token`, 
        values: [token]
    }
    const result = await db.query(query)

    if (result.rows.length === 1 && result.rows[0]["token"] === token) {
        return true
    } else {
        return false
    }
}

async function insertRefreshToken(token, maxAge) {
    const query = {
        text: `INSERT INTO refresh_token (token,user_id, max_age_seconds) VALUES ($1, $2, $3) RETURNING id`, 
        values: [token, maxAge]
    }
    const result = await db.query(query)
    if (result.rows && result.rows[0]) {
        return result.rows[0].id
    } else {
        return null
    }
}

async function deleteRefreshToken(token) {
    const query = {text: `DELETE FROM refresh_token WHERE token = $1`, values: [token]}
    await db.query(query)
}

async function clearOldRefreshTokens() {
    const query = {
        text: `DELETE FROM refresh_token WHERE EXTRACT(EPOCH FROM (now() - refresh_token.last_access)) > refresh_token.max_age_seconds;`
    }
    await db.query(query)
}

module.exports = {
    getUser,
    insertUser,
    checkRefreshToken,
    insertRefreshToken,
    deleteRefreshToken
}