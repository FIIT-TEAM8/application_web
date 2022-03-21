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

module.exports = {
    getUser,
    insertUser,
}