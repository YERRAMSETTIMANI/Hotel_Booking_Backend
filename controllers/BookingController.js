const Booking = require("../models/booking");
const user = require("../models/user");
const Hotel = require("../models/hotel");

const bookRoom = async (req,res)=>{
    const {startDate,endDate,noOfPersons,noOfRooms,typeOfRoom} = req.body
    console.log(req.params)
    const UserId = req.params.userId;
    const HotelName = req.params.hotelName;
    const User = await user.find({userId : UserId})
    const HotelExist = await Hotel.find({hotelName : HotelName})
    const listOfStartDates = [];
    for(let i=0; i< User[0].booking.length ; i++){
        var BookExist = await Booking.find({_id: User[0].booking[i]._id})
        if(BookExist.length!==0){
        var StartDate = BookExist[0].startDate;
        var Year = StartDate.getFullYear();
        var Month = +StartDate.getMonth()+1;
        var Month1 = Month < 10 ? "0"+Month : Month;
        var Date1 = StartDate.getDate() < 10 ? "0"+StartDate.getDate():StartDate.getDate();
        var formatedStartDate = Year+"-"+Month1+"-"+Date1;        
        listOfStartDates.push(formatedStartDate)
        }
    }   
    const StartDateExist = listOfStartDates.filter(StartDate=> startDate === StartDate);
    const q = new Date();
    const y = q.getFullYear();
    var m = +q.getMonth()+1;
    var m1 = m < 10 ? "0"+m : m;
    const d = q.getDate() < 10 ? "0"+q.getDate():q.getDate();
    const date = y+"-"+m1+"-"+d;
    const checkStartDate= startDate >= date;
    const checkEndDate = endDate >= startDate;
    try{
        if(UserId !== req.userId){
        return res.status(400).json({"status" : "error" , data :{message : "Not a valid User Id"}})
        }
        else if(HotelExist.length === 0){
        return res.status(400).json({"status" : "error" , data :{message : "Not a valid Hotel Name"}})
        }
        else if(!checkStartDate){
        return res.status(400).json({"status" : "error" , data :{message : "Start Date should be a greater than or equal to today"}})
        }
        else if(!checkEndDate){
        return res.status(400).json({"status" : "error" , data :{message : "End Date should be a date greater than or equal to start date"}})
        }
        else if(! (noOfPersons > 0 && noOfPersons <= 5)){
        return res.status(400).json({"status" : "error" , data :{message : "Number of Persons should be a valid number greater than 0 and less then or equal to 5"}})
        }
        else if(! (noOfRooms > 0 && noOfRooms <= 3)){
        return res.status(400).json({"status" : "error" , data :{message : "Number of rooms should be a valid number greater than 0 and less then or equal to 3"}})
        }        
        else if(StartDateExist.length !== 0){
        return res.status(400).json({"status" : "error" , data :{message : "You have a booking on the same date"}})
        }
        const newData = new Booking({startDate,endDate,noOfPersons,noOfRooms,typeOfRoom});
        const bookingData = await newData.save()
        User[0].booking.push(bookingData);
        User[0].save();
        res.cookie(`${HotelName}`,`${bookingData.bookingId}`)
        return res.status(201).json({"status" : "success" , data :{message : `Successfully made a booking with booking id ${bookingData.bookingId}`}, bookingData})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const RescheduleBooking = async (req,res)=>{
    const {startDate,endDate,bookingId} = req.body
    const UserId = req.params.userId;
    const User = await user.find({userId : UserId})
    const listOfBookings = [];
    for(let i=0; i< User[0].booking.length ; i++){
        var BookExist = await Booking.find({_id: User[0].booking[i]._id})
        var BookingId = BookExist[0].bookingId
        listOfBookings.push(BookingId)
    }   
    const q= new Date()
    const y = q.getFullYear();
    var m = +q.getMonth()+1;
    var m1 = m < 10 ? "0"+m : m;
    const d = q.getDate() < 10 ? "0"+q.getDate():q.getDate();
    const date = y+"-"+m1+"-"+d;
    const checkStartDate= startDate >= date;
    const checkEndDate = endDate >= startDate;
    try{
        if(UserId !== req.userId || ! listOfBookings.includes(bookingId)){
        return res.status(400).json({"status" : "error" , data :{message : "Not a valid Booking Id or User Id"}})
        }
        else if(!checkStartDate){
        return res.status(400).json({"status" : "error" , data :{message : "Start Date should be a greater than or equal to today"}})
        }
        else if(!checkEndDate){
        return res.status(400).json({"status" : "error" , data :{message : "End Date should be a date greater than or equal to start date"}})
        }        
        const doc = await Booking.find({bookingId :bookingId})
        const newData = await doc[0].updateOne({ startDate:startDate,endDate:endDate,bookingId:bookingId})
        return res.status(201).json({"status" : "success" , data :{message : `Successfully rescheduled the booking with booking id ${bookingId}`}, newData})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const DeleteBooking = async (req,res)=>{
    try{
        const BookingId = req.params.bookingId;
        const UserId = req.params.userId;
        const User = await user.find({userId : UserId})
        const listOfBookings = [];
        var DeletedBookId;
        for(let i=0; i< User[0].booking.length ; i++){
            var id1 =  User[0].booking[i]._id;
            var bookExistForDelete = await Booking.find({_id: id1})
            var bookingIdForDelete = bookExistForDelete[0].bookingId
            if(bookingIdForDelete === BookingId){
                DeletedBookId = id1;
            }
            listOfBookings.push(bookingIdForDelete)
        }   
        if(UserId !== req.userId  || ! listOfBookings.includes(BookingId)){
        return res.status(400).json({"status" : "error" , data :{message : "Could not delete the booking"}})
        }
        const newData = await user.updateOne({userId : UserId},{ $pull : { booking : DeletedBookId}})
        const BookExist = await Booking.deleteOne({bookingId : BookingId})
        return res.status(201).json({"status" : "success" , data :{message : `Successfully deleted the booking with booking id ${BookingId}`}})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
} 

const getTotalBookings = async (req,res)=>{
    try{
        const UserId = req.params.userId;
        const newData = await user.find({userId: UserId});
        const BookingData = [];
        for(let i=0; i< newData[0].booking.length ; i++){
        BookingData.push(await Booking.find({_id: newData[0].booking[i]._id}))
        }
        if(BookingData.length){
         return res.status(201).json({"status" : "success" ,"results": BookingData.length, data :{UserBookings : BookingData[0]}})
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