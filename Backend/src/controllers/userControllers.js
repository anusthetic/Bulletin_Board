const redisClient = require('../config/redis');
const pool = require('../config/db');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {parsePagination,validate,sendError } = require('../middleware/validate');


const register = async (req, res) => {
    try{

        //first we will validate the data using validator function
        validate(req.body);

        const {name, email, password,role} = req.body;
        if(!role) role = 'student';
        await pool.query('BEGIN');
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            await pool.query('ROLLBACK');

            return sendError(res,409,'A user with this email already exists',{field: 'email',});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id,name,email,role,created_at AS "createdAt"`,[name, email, passwordHash, role]
        );

        const createdUser = result.rows[0];

        const token = jwt.sign({id:createdUser.id , email:createdUser.email, role:createdUser.role},process.env.JWT_SECRET_KEY,{expiresIn: "1h"});

        await pool.query('COMMIT');

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: 'Registered successfully',
            user: createdUser,
        });
        
    }
    catch(err){
        console.error(err);
        await pool.query("ROLLBACK");
        return sendError(res,500,"Something went wrong while registering.");
    }
}

const login = async (req,res)=>{

    try{
        const {email,password} = req.body;

        //if any of the fields is missing, throw an error
        if(!email || !password) return sendError(res,401,"Invalid Credentials");

        const result = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1',[email]);
        if (result.rows.length === 0) {
            return sendError(res, 401, 'Invalid Credentials');
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password,user.password_hash);
        if(!match) return sendError(res,401,"Invalid Credentials");

        const reply = {
            name: user.name,
            email: user.email,
            id: user.id,
            role: user.role
        }

        const token = jwt.sign({id:user.id , email:user.email, role:user.role},process.env.JWT_SECRET_KEY,{expiresIn: 3600});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).json({
            user:reply,
            message:"Logged in successfully"
        })

    }

    catch (err) {
        console.error('login error:', err);
        return sendError(res, 500, 'Something went wrong while logging in');
    }

}

const logout = async (req,res)=>{

    try{
        // add token to redis blocklist
        const {token} = req.cookies;
        if (!token) {
            return sendError(res, 401, "No token found");
        }

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("token",null,{expires: new Date(Date.now())});
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
        
        // cookies ko clear kar denge
    }
    catch(err){
        return sendError(res,500,"Something went wrong while logging out");
    }

}

const listUsers = async function(req, res) {
    const { limit, offset } = parsePagination(req.query);

    try {
        const [rows, count] = await Promise.all([
            pool.query(
                `SELECT id,
                        name,
                        email,
                        role,
                        created_at AS "createdAt"
                 FROM users
                 ORDER BY created_at DESC
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            ),
            pool.query('SELECT COUNT(*) FROM users'),
        ]);

        return res.status(200).json({
            success: true,
            count: rows.rows.length,
            total: Number(count.rows[0].count),
            limit,
            offset,
            data: rows.rows,
        });
    } catch (err) {
        console.error('listUsers error:', err);

        return sendError(
            res,
            500,
            'Something went wrong while fetching users'
        );
    }
}

module.exports = {register,login,logout,listUsers};