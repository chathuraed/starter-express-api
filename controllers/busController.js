const Bus = require("../models/busModel");

const busController = {
  listBuses: async function (req, res) {
    try {
      const ownerId = req.userId;
      const buses = await Bus.find({ user_id: ownerId })
        // .populate("seats")
        .exec();
      return res.status(200).json(buses);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createBus: async function (req, res) {
    try {
      const {
        userId,
        busId,
        busNumber,
        model,
        seatingCapacity,
        arrangement,
        seats,
      } = req.body;

      if (!busNumber || !model || !seatingCapacity || !arrangement) {
        return res.status(400).json({
          error:
            "Bus Number, Model, Seating Capacity, and Arrangement are required.",
        });
      }

      // Check if busId is provided
      if (busId) {
        // Update existing bus
        const existingBus = await Bus.findOne({
          _id: busId,
          user_id: userId,
        }).exec();

        if (!existingBus) {
          return res.status(404).json({
            error: "Bus not found.",
          });
        }

        existingBus.set({
          busNumber,
          model,
          seatingCapacity,
          arrangement,
          seats,
        });

        const updatedBus = await existingBus.save();
        return res.status(200).json(updatedBus);
      } else {
        // Create a new bus
        const existingBus = await Bus.findOne({ busNumber }).exec();

        if (existingBus && existingBus.user_id.toString() !== userId) {
          return res.status(400).json({
            error:
              "A Bus with the same Bus Number already exists for a different user.",
          });
        }

        const newBus = new Bus({
          busNumber,
          model,
          seatingCapacity,
          arrangement,
          user_id: userId,
          seats,
        });

        const savedBus = await newBus.save();
        return res.status(201).json(savedBus);
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Failed to create/update bus. " + err.message });
    }
  },
  getBus: async function (req, res) {
    try {
      const id = req.query.id;
      const userId = req.userId;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Bus ID is required in the query parameters." });
      }

      const bus = await Bus.findOne({
        _id: id,
        user_id: userId,
      }).exec();

      if (!bus) {
        return res
          .status(404)
          .json({ error: "Bus not found or access denied" });
      }

      return res.status(200).json(bus);
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

module.exports = busController;
