const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const scheduleController = require("../controllers/scheduleController");
const { verifyToken } = require("../middlewares/authMiddleware");
const busController = require("../controllers/busController");
const bookingController = require("../controllers/bookingController");

router.get(
  "/dashboard",
  verifyToken(["owner"]),
  ownerController.getDashboardData
);
router.get("/routes", verifyToken(["owner"]), ownerController.listRoutes);
router.post("/route", verifyToken(["owner"]), ownerController.createRoute);
router.get("/route", verifyToken(["owner"]), ownerController.getRoute);
router.put("/route", verifyToken(["owner"]), ownerController.updateRoute);
router.delete("/route", verifyToken(["owner"]), ownerController.deleteRoute);

router.get(
  "/schedules",
  verifyToken(["owner"]),
  scheduleController.listSchedules
);
router.post(
  "/schedule",
  verifyToken(["owner"]),
  scheduleController.addScheduleToRoute
);

router.get("/buses", verifyToken(["owner"]), busController.listBuses);
router.get("/bus", verifyToken(["owner"]), busController.getBus);
router.post("/bus", verifyToken(["owner"]), busController.createBus);

router.post(
  "/bookings-by-date",
  verifyToken(["owner"]),
  bookingController.getBookingsByOwner
);

module.exports = router;
