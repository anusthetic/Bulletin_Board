const {Pool} = require('pg');
const url = require('url');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        ca: process.env.caCertificate,
        rejectUnauthorized: false
    },

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000

});

module.exports = pool;