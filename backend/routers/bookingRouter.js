const express= require('express');
const bookingRouter= express.Router();
const auth = require('../middlewares/auth');
const Bus = require('../schemas/Bus');
const Bookings = require('../schemas/Bookings');



bookingRouter.post("/book-seat/:busId",auth, async(req,res)=>{

    
    // console.log(req.user);
    const userId= req.user.id;
    
    if(req.user.role !== 'user'){ 
        return res.status(403).json({
            message:"Forbidden"
        });
    }       
    console.log("hii")          
    const { busId } = req.params;
    const { seatNumber } = req.body;        

    try {
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }
        
        if(seatNumber < 1 || seatNumber > bus.totalSeats){
            return res.status(400).json({
                message: "Invalid seat number"
            });
        }

        // for(let i=0;i<bus.seats.length;i++){
        //     console.log(bus.seats[i]);
        // }

        // Check if the seat is available
        if (bus.seats[seatNumber - 1].isBooked) {
            return res.status(400).json({
                message: "Seat is already booked"
            });
        }


        //payment gateway integration can be done here
        
        //successful payment can be assumed here

        // Book the seat
        bus.seats[seatNumber - 1].isBooked = true;
        await bus.save();

        // for(let i=0;i<bus.seats.length;i++){
        //     console.log(bus.seats[i]);
        // }
    


        
        const booking = await Bookings.create({
            userId,
            busId: bus._id,
            seatNumber,
            bookedSeats: bus.seats.filter((seat) => seat.isBooked === true).length,
            availableSeats: bus.seats.filter((seat) => seat.isBooked === false).length,
            status: "booked",
            paymentStatus: "paid",
        });

        return res.status(201).json({
            message: "Ticket booked successfully",
            booking,
        });
    
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


bookingRouter.get("/my-bookings",auth, async(req,res)=>{

    if(req.user.role !== 'user'){ 
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    try {
        const bookings = await Bookings.find({ userId: req.user.id });
        return res.status(200).json({
            message: "User bookings retrieved successfully",
            bookings
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


bookingRouter.post("/cancel-booking/:bookingId",auth, async(req,res)=>{

    if(req.user.role !== 'user'){
        return res.status(403).json({
            message: "Forbidden"
        });
    }   
    const { bookingId } = req.params;

    try {
        const booking = await Bookings.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }   
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only cancel your own bookings"
            });
        }   
        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }       
        const bus = await Bus.findById(booking.busId);              
        if (!bus) {             
            return res.status(404).json({
                message: "Bus not found"
            });
        }       

        // Free the booked seat
        bus.seats[booking.seatNumber - 1].isBooked = false;
        await bus.save();

        // Update booking status
        booking.status = "cancelled";
        booking.paymentStatus = "pending"; // Assuming refund process

        await Bookings.findByIdAndDelete({_id: bookingId})
        await booking.save();



        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});



module.exports = bookingRouter;
