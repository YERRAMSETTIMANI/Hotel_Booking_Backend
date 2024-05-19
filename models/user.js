const mongoose = require("mongoose")
const mongooseSequence = require("mongoose-sequence")

const userSchema = new mongoose.Schema({
    // UserId :{
    //     type : String,
    //     unique:true,
    //     required : true
    // },
    Name:{ 
        type : String,
        required:true,
    },
    Address:{
        type :String,
        required :true
    },
    EmailId:{
        type :String,
        required :true,
        unique:true
    },
    PhoneNo:{
        type :Number,
        required :true
    },
    Password:{
        type :String,
        required :true
    },
    Booking:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking"
        }
    ]
},
{
    timestamps:true
});

if(! mongoose.models?.user){
userSchema.plugin(mongooseSequence(mongoose),{ inc_field: 'UserId' });
}
 
const User = mongoose.model("user", userSchema);
module.exports = User;