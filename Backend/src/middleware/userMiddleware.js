const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const pool = require('../config/db');
const {sendError} = require('./validate');

const userMiddleware = async (req,res,next)=>{

    try{
        const {token} = req.cookies;
        if(!token)  return sendError(res, 401, "Authentication token is missing");

        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const {id} = payload;
        if(!id)  throw new Error("Invalid token");

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if(result.rows.length === 0) throw new Error("User doesn't exist");

        // check whether it is present in redis blocklist

        const isBlocked = await redisClient.exists(`token:${token}`);

        if(isBlocked)  throw new Error("Invalid token");
        const user = result.rows[0];
        req.user = user;

        next();

    }
    catch (err) {
        console.error(err);

        return sendError(res, 401, err.message);
    }

}

module.exports = userMiddleware;