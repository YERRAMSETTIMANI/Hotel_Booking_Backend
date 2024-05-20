const Hotel = require("../models/hotel");
const Booking = require("../models/booking")

const addReview = async (req,res)=>{
    try{
        const {hotelName,reviews} = req.body
        const HotelExist = await Hotel.find({hotelName : hotelName})
        if(HotelExist.length === 0){
        return res.status(400).json({"status" : "error" , data : {message : "Not a valid Hotel Name"}});
        }
        const BookingId = req.cookies[hotelName]
        var bookExist = await Booking.find({bookingId : BookingId})
        const todayDate= new Date()
        const checkEndDate = bookExist[0].endDate <= todayDate;
        if(! checkEndDate){
        return res.status(400).json({"status" : "error" , data : {message : "Cannot add a review until you stay at this hotel"}});
        }
        const newData = await HotelExist[0].updateOne({reviews : reviews});
        return res.status(201).json({"status" : "success" , data : {message : `Successfully added the review for ${hotelName}`}});
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const getReviews = async (req,res)=>{
    const hotelName = req.params.hotelName;
    const newData = await Hotel.find({hotelName : hotelName});
    const Reviews = newData[0].reviews;
    try{
        if(newData.length === 0){
        return res.status(400).json({"status" : "error" , data :{message : `${hotelName} is not a valid hotel`}})
        }
        if(! newData[0].reviews.length){
        return res.status(400).json({"status" : "error" , data :{message : `No reviews added yet for ${hotelName}`}})
        }
        return res.status(201).json({"status" : "success" ,"results": newData[0].reviews.length, data :[{Reviews}]})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}



module.exports = {addReview,getReviews}