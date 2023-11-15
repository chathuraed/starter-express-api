const Route = require("../models/routeModel");
const Schedule = require("../models/scheduleModel");

const ownerController = {
  listRoutes: async function (req, res) {
    try {
      const ownerId = req.userId;
      const routes = await Route.find({ user_id: ownerId })
        .populate("schedules")
        .exec();
      return res.status(200).json(routes);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createRoute: async function (req, res) {
    try {
      const { permit_id, origin, destination } = req.body;
      const userId = req.userId;

      if (!permit_id || !origin || !destination) {
        return res
          .status(400)
          .json({ error: "Permit ID, origin, and destination are required." });
      }

      const existingRoute = await Route.findOne({ permit_id }).exec();

      if (existingRoute) {
        if (existingRoute.user_id !== userId) {
          return res.status(400).json({
            error:
              "A route with the same permit ID already exists for a different user.",
          });
        }
      }

      const newRoute = new Route({
        permit_id,
        origin,
        destination,
        user_id: userId,
      });

      const savedRoute = await newRoute.save();
      return res.status(201).json(savedRoute);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getRoute: async function (req, res) {
    try {
      const routeId = req.query.id;
      const userId = req.userId;

      if (!routeId) {
        return res
          .status(400)
          .json({ error: "Route ID is required in the query parameters." });
      }

      const route = await Route.findOne({
        _id: routeId,
        user_id: userId,
      }).exec();

      if (!route) {
        return res
          .status(404)
          .json({ error: "Route not found or access denied" });
      }

      return res.status(200).json(route);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateRoute: async function (req, res) {
    try {
      const permitId = req.body.permit_id;
      const userId = req.userId;

      const existingRoute = await Route.findOne({
        permit_id: permitId,
        user_id: userId,
      }).exec();

      if (!existingRoute) {
        return res
          .status(404)
          .json({ error: "Route not found or access denied" });
      }

      // Update route properties based on req.body
      const { permit_id, origin, destination } = req.body;
      existingRoute.permit_id = permit_id;
      existingRoute.origin = origin;
      existingRoute.destination = destination;

      const updatedRoute = await existingRoute.save();
      return res.status(200).json(updatedRoute);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteRoute: async function (req, res) {
    try {
      const routeId = req.params.id;
      const userId = req.userId; // Extract user ID from the JWT token

      // Check if the route with routeId exists and belongs to the current user
      const existingRoute = await Route.findOne({
        _id: routeId,
        user_id: userId,
      }).exec();

      if (!existingRoute) {
        return res
          .status(404)
          .json({ error: "Route not found or access denied" });
      }

      await existingRoute.deleteOne();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addScheduleToRoute: async function (req, res) {
    try {
      const routeId = req.params.id;
      const { start_time, end_time, origin, destination } = req.body;

      // Check if the route exists
      const existingRoute = await Route.findById(routeId).exec();

      if (!existingRoute) {
        return res.status(404).json({ error: "Route not found" });
      }

      // Create a new Schedule entry with origin and destination, and reference it to the existing route
      const newSchedule = new Schedule({
        route: existingRoute._id, // Reference the existing Route
        origin,
        destination,
        start_time,
        end_time,
      });

      await newSchedule.save();

      return res.status(201).json(newSchedule);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = ownerController;
