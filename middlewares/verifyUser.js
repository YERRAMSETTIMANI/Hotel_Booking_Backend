const User = require("../models/user")

const verifyUser = async(req,res,next)=>{
    const login = req.cookies["username"]
    if(! login){
        return res.status(400).json("User is not logged in")
    }
    try {
        const DecodedUserId = login.length === 5? parseInt(login.substr(2,3)):null;
        const user = await User.find({UserId : DecodedUserId})
        if(!user){
            return res.status(400).json("User not existed")
        }
        req.UserId = login;
        next()

    } catch (error) {
        return res.status(500).json("Internal server error")
    }
}

module.exports = verifyUser
