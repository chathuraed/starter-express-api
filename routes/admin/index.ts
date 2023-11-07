// routes/auth.js

import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController";
import { verifyToken } from "../middlewares/authMiddleware";

router.get("/users", verifyToken(["admin"]), adminController.listUsers);
router.get("/user/:id", verifyToken(["admin"]), adminController.getUser);
// router.put("/user/:id/update", adminController.updateUser);
// router.delete("/user/:id/delete", adminController.deleteUser);

router.get("/buses", verifyToken(["admin"]), adminController.listBuses);
// router.get("/bus/:id", adminController.getBus);
// router.put("/bus/:id/update", adminController.updateBus);
// router.delete("/bus/:id/delete", adminController.deleteBus);
// router.get("/routes", adminController.listRoutes);
// router.get("/route/:id", adminController.getRoute);
// router.put("/route/:id/update", adminController.updateRoute);
// router.delete("/route/:id/delete", adminController.deleteRoute);

export default router;
