const userController = require("../controllers/UserController")
const express = require("express")
const router = express.Router()
const verifyUser = require("../middlewares/verifyUser")

router.post("/register",userController.userRegister);
router.post("/login",userController.userLogin)
router.get("/logout",userController.userLogout)

module.exports = router;