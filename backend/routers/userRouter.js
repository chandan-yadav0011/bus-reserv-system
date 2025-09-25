const express = require('express');
const appRouter = express.Router();
const User = require("../schemas/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie= require('cookie-parser');



appRouter.post("/signup",async(req,res)=>{


    const {name, email,password,role} = req.body;

    const passwordHash = await bcrypt.hash(password,10);
    
    const user = await User.create({
            name,
            email,
            password: passwordHash,
            role,
    });

    user.save();

    res.status(200).json({
        message:"user created successfully"
    })
});

appRouter.post("/login",async(req,res)=>{

    const {email,password} = req.body;

    const user = await User.findOne({email: email});

    if(!user){
        return res.status(400).json({
            message:"User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        });
    }
    
    const payload = {
        id: user._id,
        role: user.role,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
   // console.log(token);
    const cookieOptions = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    };

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        message:"Login successful",
        token
    });
});


module.exports = appRouter;