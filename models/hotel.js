const mongoose = require("mongoose")

const hotelSchema = new mongoose.Schema({
    Reviews:[
        {
            type:String
        }
    ],
    HotelName :{
        type : String,
    },
    City:{
        type:String,
    },
    Description:{
        type : String,
    },
    Amenities:{
        type :String,
    },
    PhoneNo:{
        type :Number,
    },
    Address:{
        type :String,
    },
},
{
    timestamps:true,
}
);

const Hotel = mongoose.model("hotel", hotelSchema);
module.exports = Hotel;