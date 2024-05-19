const Booking = require("../models/booking");
const user = require("../models/user");
const Hotel = require("../models/hotel");

const bookRoom = async (req,res)=>{
    const {StartDate,EndDate,NoOfPersons,NoOfRooms,TypeOfRoom} = req.body
    const userId = req.params.userId;
    const HotelName = req.params.hotelName;
    const DecodedUserId = userId.length === 5? parseInt(userId.substr(2,3)):null;
    const User = await user.find({UserId : DecodedUserId})
    const listOfStartDates = [];
    const HotelExist = await Hotel.find({HotelName : HotelName})
    for(let i=0; i< User[0].Booking.length ; i++){
        var BookExist = await Booking.find({_id: User[0].Booking[i]._id})
        var startDate = BookExist[0].StartDate
        var Year = startDate.getFullYear();
        var Month = +startDate.getMonth()+1;
        var Month1 = Month < 10 ? "0"+Month : Month;
        var Date1 = startDate.getDate() < 10 ? "0"+startDate.getDate():startDate.getDate();
        var formatedStartDate = Year+"-"+Month1+"-"+Date1;        
        listOfStartDates.push(formatedStartDate)
    }   
    const StartDateExist = listOfStartDates.filter(startDate=> startDate === StartDate);
    const q = new Date()
    const y = q.getFullYear();
    const m = q.getMonth() < 10 ? "0"+q.getMonth() : q.getMonth();
    const d = q.getDate() < 10 ? "0"+q.getDate():q.getDate();
    const date = y+"-"+m+"-"+d;
    const checkStartDate= StartDate >= date;
    const checkEndDate = EndDate >= StartDate;
    try{
        if(!checkStartDate){
        return res.status(400).json({"status" : "error" , data :{message : "Start Date should be a greater than or equal to today"}})
        }
        else if(!checkEndDate){
        return res.status(400).json({"status" : "error" , data :{message : "End Date should be a date greater than or equal to start date"}})
        }
        else if(! (NoOfPersons > 0 && NoOfPersons <= 5)){
        return res.status(400).json({"status" : "error" , data :{message : "Number of Persons should be a valid number greater than 0 and less then or equal to 5"}})
        }
        else if(! (NoOfRooms > 0 && NoOfRooms <= 3)){
        return res.status(400).json({"status" : "error" , data :{message : "Number of rooms should be a valid number greater than 0 and less then or equal to 3"}})
        }
        else if(userId !== req.UserId){
        return res.status(400).json({"status" : "error" , data :{message : "Not a valid User Id"}})
        }
        else if(HotelExist.length === 0){
        return res.status(400).json({"status" : "error" , data :{message : "Not a valid Hotel Name"}})
        }
        else if(StartDateExist.length !== 0){
        return res.status(400).json({"status" : "error" , data :{message : "You have a booking on the same date"}})
        }
        const newData = new Booking({StartDate,EndDate,NoOfPersons,NoOfRooms,TypeOfRoom});
        const bookingData = await newData.save()
        User[0].Booking.push(bookingData);
        User[0].save();
        const BookingId = "B-"+ bookingData.BookingId.toString().padStart(3,"0")  
        return res.status(201).json({"status" : "success" , data :{message : `Successfully made a booking with booking id ${BookingId}`}, newData})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const RescheduleBooking = async (req,res)=>{
    const {StartDate,EndDate,BookingId} = req.body
    const userId = req.params.userId;
    const DecodedBookId = BookingId.length === 5? parseInt(BookingId.substr(2,3)):null;
    console.log(BookingId,DecodedBookId)
    const q= new Date()
    const y = q.getFullYear();
    const m = q.getMonth() < 10 ? "0"+q.getMonth() : q.getMonth();
    const d = q.getDate() < 10 ? "0"+q.getDate():q.getDate();
    const date = y+"-"+m+"-"+d;
    const checkStartDate= StartDate >= date;
    const checkEndDate = EndDate >= StartDate;
    try{
        if(!checkStartDate){
        return res.status(400).json({"status" : "error" , data :{message : "Start Date should be a greater than or equal to today"}})
        }
        else if(!checkEndDate){
        return res.status(400).json({"status" : "error" , data :{message : "End Date should be a date greater than or equal to start date"}})
        }
        else if(userId !== req.UserId){
        return res.status(400).json({"status" : "error" , data :{message : "Not a valid User Id"}})
        }
        const newData = new Booking({StartDate,EndDate,BookingId : DecodedBookId});
        await newData.save()
        return res.status(201).json({"status" : "success" , data :{message : `Successfully rescheduled the booking with booking id ${BookingId}`}, newData})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const DeleteBooking = async (req,res)=>{
    const bookingId = req.params.bookingId;
    const userId = req.params.userId;
    const DecodedBookId = bookingId.length === 5? parseInt(bookingId.substr(2,3)):null;
    const BookExist = await Booking.deleteOne({BookingId : DecodedBookId})
    try{
        if(userId !== req.UserId){
        return res.status(400).json({"status" : "error" , data :{message : "Could not delete the booking"}})
        }
        return res.status(201).json({"status" : "success" , data :{message : `Successfully deleted the booking with booking id ${bookingId}`}})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
} 

const getTotalBookings = async (req,res)=>{
    const newData = await Booking.find();
    try{
        if(newData.length){
         return res.status(201).json({"status" : "success" ,"results": newData.length, data :{UserBookings : newData}})
        }
        else{
        return res.status(400).json({"status" : "success" ,data :{message : "No Bookings done yet"}})
        }
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
} 



module.exports = {bookRoom,RescheduleBooking,DeleteBooking,getTotalBookings}