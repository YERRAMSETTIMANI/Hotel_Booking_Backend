const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
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
    booking:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"booking"
        }
    ],
    userId :{
        type : String,
        index: true,
        unique: true,
    },
},
{
    timestamps:true
});

userSchema.pre('save', async function (next) {
    const user = this;
    console.log(user)
    if (user.isNew) {
        try{
            const lastUser = await User.findOne().sort({ _id: -1 });
            const lastId = lastUser ? lastUser.userId : 'U-000';
            const idNumber = parseInt(lastId.split('-')[1], 10) + 1;
            user.userId = `U-${idNumber.toString().padStart(3, '0')}`; 
            console.log(user)
        }
        catch(error){
            return next(error);
        }
        }
    next();
  });
  
 
const User = mongoose.model("User", userSchema);
module.exports = User;