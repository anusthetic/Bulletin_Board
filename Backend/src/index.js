require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const pool = require('./config/db'); 
const authRouter = require('./routes/userRoutes');
const noticeRouter = require('./routes/noticeRoutes');
const eventRouter = require('./routes/eventRoutes');
const cookieParser = require("cookie-parser");
const redisClient = require('./config/redis');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

// Route groups
app.use('/user', authRouter);
app.use('/notices', noticeRouter);
app.use('/events', eventRouter);

const InitializeConnection = async()=>{

    try{

        const sql = fs.readFileSync(path.join(__dirname,'config', 'schema.sql'), 'utf8');

        await pool.query(sql)
        console.log('Tables created successfully!');
        
        await redisClient.connect();
        console.log("Redis connected successfully!");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on PORT: ${process.env.PORT}`);
        });

    }
    catch (err) {
        console.error("Database initialization failed:", err);
        process.exit(1);
    }

}

InitializeConnection();