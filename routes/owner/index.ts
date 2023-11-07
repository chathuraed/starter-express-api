import express from "express";
const router = express.Router();
import ownerController from "../controllers/ownerController";
import scheduleController from "../controllers/scheduleController";
import { verifyToken } from "../middlewares/authMiddleware";

router.get("/routes", verifyToken(["owner"]), ownerController.listRoutes);
router.post("/route", verifyToken(["owner"]), ownerController.createRoute);
router.get("/route", verifyToken(["owner"]), ownerController.getRoute);
router.put("/route", verifyToken(["owner"]), ownerController.updateRoute);
router.delete("/route", verifyToken(["owner"]), ownerController.deleteRoute);

router.get("/schedules", verifyToken(["owner"]), scheduleController.listSchedules);
router.post("/schedule", verifyToken(["owner"]), scheduleController.addScheduleToRoute);


export default router;
