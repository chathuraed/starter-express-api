const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const scheduleController = require("../controllers/scheduleController");
const router = express.Router();

router.get(
  "/schedules",
  verifyToken(["passenger"]),
  scheduleController.findSchedules
);

module.exports = router;
