const User = require("../models/user");

const userRegister = async (req,res)=>{
    const {Name,Address,PhoneNo,EmailId,Password} = req.body
    try{
        const exist = await User.findOne({EmailId});
        const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(EmailId);
        if(exist){
            return res.status(400).json({"status" : "error" , data :{message : "User exists with this email id"}})
        }
        else if(!validEmail){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid email id"}})
        }
        else if(Name.length <3){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid name with at least 3 characters"}})
        }
        else if(PhoneNo.length < 10 || PhoneNo.length >10){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid phone no with 10 digitts"}})
        }
        else if(Password.length < 8 || Password.length > 12){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid password with atleast 8 and not more than 12 characters"} })
        }    
        const newData = new User({ 
           Name,Address,PhoneNo,EmailId,Password
        });
        const userData = await newData.save() 
        const UserId = "U-"+ userData.UserId.toString().padStart(3,"0")    
        res.status(201).json({"status" : "success" , data :{message : `Successfully registered with user id ${UserId}`},userData})
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const userLogin = async (req,res)=>{
    const {UserId,Password} = req.body
    const DecodedUserId = UserId.length === 5? parseInt(UserId.substr(2,3)):null;
    try{
        const exist = await User.findOne({UserId : DecodedUserId});
        if(!exist  || Password !== exist.Password){
            return res.status(400).json({"status" : "error" , data :{message : "Incorrect user Id or Password"} })
        }
        else if(Password.length < 8 || Password.length > 12){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid password with atleast 8 and not more than 12 characters"} })
        }
        
        res.cookie('username', `${UserId}`, {httpOnly: false });
        return res.status(201).json({"status" : "success" , data :{message : "user login successfully"} })
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}

const userLogout = async (req,res)=>{
    try{
    const cookies = Object.keys(req.cookies)
    const clearCookie = cookies.map(cookie=> res.clearCookie(`${cookie}`))
    return res.status(200).json({"status" : "success" , data :{message : "You are logged out!!"} })
    }
    catch(error){
        return res.status(500).json({error:"internal server error"})
    }
}


module.exports = {userRegister,userLogin,userLogout}