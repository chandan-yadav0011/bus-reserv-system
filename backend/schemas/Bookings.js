const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },

    busId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Bus",
        required: true
    },

    seatNumber:{
        type: Number,
        required: true
    },
    bookedSeats:{
        type:Number,

    },

    availableSeats:{
        type: Number,

    },



    status:{
        type: String,
        enum: ["cancelled", "booked"],
        default:"booked"
    },

    paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }


    
},{
    timestamps:true
}); 

module.exports = mongoose.model("Booking", BookingSchema);