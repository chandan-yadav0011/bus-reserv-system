const express = require('express');
const app = express();
const User = require("../backend/schemas/User");
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');

app.post("/signup",async(req,res)=>{


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


app.listen(8000,()=>{
    console.log("listening on port  8000")
})