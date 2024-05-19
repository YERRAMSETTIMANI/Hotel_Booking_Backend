const Hotel = require("../models/hotel");
const Booking = require("../models/booking")

const addReview = async (req,res)=>{
    try{
        const {HotelName,Reviews} = req.body
        const HotelExist = await Hotel.find({HotelName : HotelName})
        if(HotelExist.length === 0){
        return res.status(400).json({"status" : "error" , data : {message : "Not a valid Hotel Name"}});
        }
        const BookingId = req.cookies[`${HotelName}`]
        const DecodedBookId = BookingId.length === 5? parseInt(BookingId.substr(2,3)):null;
        var bookExist = await Booking.find({BookingId : DecodedBookId})
        const todayDate= new Date()
        const checkEndDate = bookExist[0].EndDate <= todayDate;
        if(! checkEndDate){
        return res.status(400).json({"status" : "error" , data : {message : "Cannot add a review until you stay at this hotel"}});
        }
        const newData = await HotelExist[0].updateOne({Reviews : Reviews});
        return res.status(201).json({"status" : "success" , data : {message : `Successfully added the review for ${HotelName}`}});
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const getReviews = async (req,res)=>{
    const hotelName = req.params.hotelName;
    const newData = await Hotel.find({HotelName : hotelName});
    const Reviews = newData[0].Reviews;
    try{
        if(newData.length === 0){
        return res.status(400).json({"status" : "error" , data :{message : `${hotelName} is not a valid hotel`}})
        }
        if(! newData[0].Reviews.length){
        return res.status(400).json({"status" : "error" , data :{message : `No reviews added yet for ${hotelName}`}})
        }
        return res.status(201).json({"status" : "success" ,"results": newData[0].Reviews.length, data :[{Reviews}]})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}



module.exports = {addReview,getReviews}