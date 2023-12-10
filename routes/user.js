const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const scheduleController = require("../controllers/scheduleController");
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.post(
  "/schedules",
  verifyToken(["passenger"]),
  scheduleController.findSchedules
);

router.get(
  "/bookings",
  verifyToken(["passenger"]),
  bookingController.getBookings
);

router.post(
  "/book-seat",
  verifyToken(["passenger"]),
  bookingController.createBooking
);

module.exports = router;
