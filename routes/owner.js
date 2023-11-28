const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const scheduleController = require("../controllers/scheduleController");
const { verifyToken } = require("../middlewares/authMiddleware");
const busController = require("../controllers/busController");

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
router.post(
  "/bus",
  verifyToken(["owner"]),
  busController.createBus
);

module.exports = router;
