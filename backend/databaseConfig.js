// UserName: chandanyadav8145_db_user
// Password: 67nds0S4m701z7w5
// connection String: mongodb+srv://chandanyadav8145_db_user:67nds0S4m701z7w5@cluster0.em1v2nh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect =async()=>{

    try{
       await mongoose.connect(process.env.MONGO_URL);
       console.log("Database connected successfully...");

    }
    catch(err){
        console.log(err);
    }       
    

};

module.exports = dbConnect;