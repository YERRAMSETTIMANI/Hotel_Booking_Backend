const mongoose = require("mongoose")

const hotelSchema = new mongoose.Schema({
    reviews:[
        {
            type:String
        }
    ],
    hotelName :{
        type : String,
    },
    city:{
        type:String,
    },
    description:{
        type : String,
    },
    amenities:{
        type :String,
    },
    phoneNo:{
        type :Number,
    },
    address:{
        type :String,
    },
},
{
    timestamps:true,
}
);

const Hotel = mongoose.model("hotel", hotelSchema);
module.exports = Hotel;