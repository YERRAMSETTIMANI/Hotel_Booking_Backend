const reviewController = require("../controllers/ReviewController")
const express = require("express")
const router = express.Router()
const verifyUser = require("../middlewares/verifyUser")

router.post("/",verifyUser,reviewController.addReview);
router.get("/:hotelName",reviewController.getReviews);

module.exports = router;