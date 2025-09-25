const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({

    busNumber:{
        type:String,
        required:true,
    },
    
    source:{
        type:String,
        required:true,
    },

    destination:{
        type:String,
        required:true,
    },

    fare:{
        type: Number,
        required:true
    },
    
    arrivalTime:{
        type: String,
        required:true
    },

    departureTime:{
        type: String,
        required:true
    },
    
    date:{
        type: String,
        required:true
    },
    totalSeats:{
        type: Number,
        required: true,
        default: 40
    },
    seats: [
        {
            seatNumber: {
            type: Number,
            required: true
            },
            isBooked: {
            type: Boolean,
            default: false
            }
        }
        ]
},
{
    timestamps:true
});

module.exports = mongoose.model("Bus", BusSchema);