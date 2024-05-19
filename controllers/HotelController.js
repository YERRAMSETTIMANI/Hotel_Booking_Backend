const Hotel = require("../models/hotel");

const addHotel = async (req,res)=>{
    const {HotelName,City,Description,Amenities,PhoneNo,Address} = req.body
    try{
        const newData = new Hotel({HotelName,City,Description,Amenities,PhoneNo,Address});
        await newData.save()
        res.status(201).json({"status" : "success" , newData});
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const getHotel = async (req,res)=>{
    const newData = await Hotel.find({},{_id:0});
    try{
        res.status(201).json({"status" : "success" ,"results": newData.length, data :{hotels : newData}})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}



module.exports = {addHotel,getHotel}