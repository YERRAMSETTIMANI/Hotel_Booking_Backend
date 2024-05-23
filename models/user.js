const mongoose = require("mongoose")
const Booking = require("../models/booking")

const userSchema = new mongoose.Schema({
    userId :{
        type : String,
        index: true,
        unique: true,
    },
    name:{ 
        type : String,
        required:true,
    },
    address:{
        type :String,
        required :true
    },
    emailId:{
        type :String,
        required :true,
        unique:true
    },
    phoneNo:{
        type :Number,
        required :true
    },
    password:{
        type :String,
        required :true
    },
    UserBookings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"booking"
        }
    ],
},
{
    timestamps:true
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isNew) {
        try{
            const lastUser = await User.findOne().sort({ _id: -1 });
            const lastId = lastUser ? lastUser.userId : 'U-000';
            const idNumber = parseInt(lastId.split('-')[1], 10) + 1;
            user.userId = `U-${idNumber.toString().padStart(3, '0')}`; 
        }
        catch(error){
            return next(error);
        }
        }
    next();
  });
  
 
const User = mongoose.model("User", userSchema);
module.exports = User;