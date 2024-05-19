const mongoose = require("mongoose")
const mongooseSequence = require("mongoose-sequence")

const bookingSchema = new mongoose.Schema({
    // BookingId :{
    //     type : String,
    //     unique:false
    // },
    StartDate:{
        type : Date,
        required:true,
    },
    EndDate:{
        type :Date,
        required :true
    },
    NoOfPersons:{
        type :Number,
    },
    NoOfRooms:{
        type :Number,
    },
    TypeOfRoom:{
            type:String,
    }
});

if(! mongoose.models?.UserBookings){
    bookingSchema.plugin(mongooseSequence(mongoose), {inc_field: 'BookingId'})
}
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;