const Hotel = require("../models/hotel");
const Booking = require("../models/booking")
const user = require("../models/user")

const addReview = async (req,res)=>{
    // try{
        const {hotelName,reviews} = req.body
        const HotelExist = await Hotel.find({hotelName : hotelName})
        if(HotelExist.length === 0){
        return res.status(400).json({"status" : "error" , data : {message : "Not a valid Hotel Name"}});
        }
        const todayDate= new Date()
        const bookExist = await Booking.find({bookedHotels : hotelName, endDate : {$gte : todayDate}});
        console.log(bookExist)
        const userData= await user.find({userId: req.userId},{_id:0,UserBookings:1}).populate("UserBookings")
        console.log(userData[0].UserBookings._id);
        if(bookExist.length){
        return res.status(400).json({"status" : "error" , data : {message : "Cannot add a review until you stay at this hotel"}});
        }
        const newData = await HotelExist[0].updateOne({$push : {reviews : reviews}});
        return res.status(201).json({"status" : "success" , data : {message : `Successfully added the review for ${hotelName}`}});
    // }
    // catch(error){
    //     return res.status(500).json({error:"internal server error"});
    // }
}

const getReviews = async (req,res)=>{
    const hotelName = req.params.hotelName;
    const hotel = await Hotel.find({hotelName : hotelName},{_id:0,reviews:1});
    try{
        if(hotel.length === 0){
        return res.status(400).json({"status" : "error" , data :{message : `${hotelName} is not a valid hotel`}})
        }
        if(! hotel[0].reviews.length){
        return res.status(400).json({"status" : "error" , data :{message : `No reviews added yet for ${hotelName}`}})
        }
        return res.status(201).json({"status" : "success" ,"results": hotel[0].reviews.length, data : hotel})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}



module.exports = {addReview,getReviews}