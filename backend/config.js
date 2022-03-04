// ENV variables can be loaded by creating a local .env file
// The variables are loaded automatically using the following command
require('dotenv').config()

// Basic config (all variables are recommended to be left at default)
const cfg = {
    APP_PORT: process.env.REACT_APP_PORT || 8080,
    IS_HTTPS: process.env.IS_HTTPS || true,
    COOKIE_AGE: process.env.COOKIE_AGE || 1000 * 60 * 60 * 24 * 30, // 30 days,
    BUILD_PATH: process.env.BUILD_PATH || '../frontend/build',
    DATA_API_HOST: process.env.DATA_API_HOST || 'http://flask_server:5000',
    DATA_API_VERSION: process.env.DATA_API_VERSION || 'v3',
}

// Modified config for development/test (not production)
if (process.env.NODE_ENV !== "production") {
    cfg.DATA_API_HOST = process.env.DEV_DATA_API_HOST || 'https://localhost:5000/api'
    cfg.IS_HTTPS = process.env.IS_HTTPS || false
}

console.log(cfg)

module.exports = {
    cfg,
}