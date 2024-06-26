const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    bookingId :{
        type : String,
        unique:true,
        index:true
    },
    startDate:{
        type : Date,
        required:true,
    },
    endDate:{
        type :Date,
        required :true
    },
    noOfPersons:{
        type :Number,
    },
    noOfRooms:{
        type :Number,
    },
    typeOfRoom:{
        type:String,
    },
    bookedHotels : [{
        type:String
    }]
});

bookingSchema.pre('save', async function(next){
    const book = this;
    if(book.isNew){
        try{
            const lastUser = await booking.findOne().sort({_id:-1});
            const lastId = lastUser ? lastUser.bookingId : 'B-000';
            const idNumber = parseInt(lastId.split('-')[1],10) + 1;
            book.bookingId = `B-${idNumber.toString().padStart(3,'0')}`;
        }
        catch(error){
            return next(error);
        }
    }
    next();
})

const booking = mongoose.model("booking", bookingSchema);
module.exports = booking;