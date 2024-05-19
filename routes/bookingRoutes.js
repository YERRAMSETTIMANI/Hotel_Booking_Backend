const bookingController = require("../controllers/BookingController")
const verifyUser = require("../middlewares/verifyUser")
const express = require("express")
const router = express.Router()

router.post("/:userId/:hotelName",verifyUser,bookingController.bookRoom);
router.put("/:userId",verifyUser,bookingController.RescheduleBooking);
router.delete("/:userId/:bookingId",verifyUser,bookingController.DeleteBooking)
router.get("/:userId",verifyUser,bookingController.getTotalBookings)
module.exports = router;