const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const pool = require('../config/db');
const {sendError} = require('./validate');

const adminMiddleware = async (req,res,next)=>{

    try{
        console.log("Cookies:", req.cookies);
        console.log("Token:", req.cookies.token);
        const {token} = req.cookies;
        if(!token)  throw new Error("Token is not possible");

        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const {id} = payload;
        if(!id)  throw new Error("Invalid token");

        // console.log(User);

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if(payload.role!='admin')  throw new Error("User doesn't exist");

        if(!result) throw new Error("User dosen't exist");

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

module.exports = adminMiddleware;