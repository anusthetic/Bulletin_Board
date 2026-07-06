const express = require('express');
const authRouter = express.Router();
const {register,login,logout, listUsers} = require('../controllers/userControllers');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//Register
//Login
//Logout
//listUsers

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post("/logout", userMiddleware, logout); 
authRouter.get("/listUsers", listUsers);

authRouter.get('/check',userMiddleware,(req,res)=>{

    const reply = {
        name: req.user.name,
        email: req.user.email,
        id: req.user.id,
        role:req.user.role
    }

    res.status(200).json({
        user: reply,
        message:"Valid User"
    });

})

module.exports = authRouter;