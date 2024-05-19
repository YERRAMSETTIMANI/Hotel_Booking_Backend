const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const bp = require("body-parser");
const userRoutes = require("./routes/userRoutes")
const hotelRoutes =require("./routes/hotelRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

const app = express()
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

dotenv.config();

mongoose.connect(process.env.Mongo_URI).then(()=>{
    console.log("Db connected successfully")
}).catch(err =>{
    console.log(err)
})

app.use(bp.json())
app.use("/",userRoutes);
app.use("/",hotelRoutes);
app.use("/bookings",bookingRoutes);
app.use("/reviews",reviewRoutes);
app.use("/homepage",(req,res)=>{
    res.send(`hello ji ${PORT}`)
})
app.use("*",async (req,res)=>{
    return res.status(404).json({"status" : "fail" ,message : "Invalid path"});
})

app.listen(PORT, ()=>{
    console.log(`server started running at port ${PORT}`)
})

