const express = require('express');
const app = express();
const User = require("../backend/schemas/User");
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const dbConnect = require('./databaseConfig');
const userRouter = require('./routers/userRouter');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

dbConnect();


app.use("/api", userRouter);
app.use("/api/bus", require("./routers/busRouter"));
app.use("/api/booking", require("./routers/bookingRouter"));

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(8000,()=>{
    console.log("listening on port  8000")
})