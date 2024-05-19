const hotelController = require("../controllers/HotelController")
const express = require("express")
const router = express.Router()

router.post("/addHotel",hotelController.addHotel);
router.get("/hotels",hotelController.getHotel)

module.exports = router;