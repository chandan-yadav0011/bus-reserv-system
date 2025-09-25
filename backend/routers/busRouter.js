const mongoose= require('mongoose');
const Bus = require('../schemas/Bus');
const auth = require('../middlewares/auth');
const express=  require('express');
const busRouter= express.Router();

busRouter.post("/add-bus",auth, async(req,res)=>{

 
    if(req.user.role !== 'admin'){      

        return res.status(403).json({       
            message:"Forbidden"
        });
    }        

    const { busNumber, source, destination, fare, arrivalTime, departureTime, date, totalSeats } = req.body;
    
    let seats = [];
    for(let i=0;i<totalSeats;i++){
        seats.push({seatNumber: i+1, isBooked: false});
    }
    try {
        const bus = new Bus({
            busNumber,
            source,
            destination,
            fare,
            arrivalTime,
            departureTime,
            totalSeats,
            date,
            seats
        });

        const nbus= await bus.save();

        console.log(nbus.seats.length);

        return res.status(201).json({
            message: "Bus added successfully",
            bus
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports = busRouter;
