const User = require("../models/user");

const userRegister = async (req,res)=>{
    const {name,address,emailId,phoneNo,password} = req.body
    try{
        const exist = await User.findOne({emailId});
        const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailId);
        if(exist){
            return res.status(400).json({"status" : "error" , data :{message : "User exists with this email id"}})
        }
        else if(!validEmail){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid email id"}})
        }
        else if(name.length <3){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid name with at least 3 characters"}})
        }
        else if(phoneNo.length < 10 || phoneNo.length >10){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid phone no with 10 digitts"}})
        }
        else if(password.length < 8 || password.length > 12){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid password with atleast 8 and not more than 12 characters"} })
        }
        const newData = new User({ 
           name,address,emailId,phoneNo,password
        });
        await newData.save() ;
        res.status(201).json({"status" : "success" , data :{message : `Successfully registered with user id ${newData.userId}`},newData})
    }
    catch(error){
            return res.status(500).json({error:"internal server error"})
    }    
}

const userLogin = async (req,res)=>{
    const {userId,password} = req.body
    try{
        const exist = await User.findOne({userId :userId});
        console.log(exist)
        if(!exist  || password !== exist.password){
            return res.status(400).json({"status" : "error" , data :{message : "Incorrect user Id or Password"} })
        }
        else if(password.length < 8 || password.length > 12){
            return res.status(400).json({"status" : "error" , data :{message : "Enter a valid password with atleast 8 and not more than 12 characters"} })
        }        
        res.cookie('username', `${userId}`, {httpOnly: false });
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