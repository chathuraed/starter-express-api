const Route = require("../models/routeModel");
const Schedule = require("../models/scheduleModel");

const scheduleController = {
  listSchedules: async function (req, res) {
    try {
      const ownerId = req.userId;
      const routes = await Schedule.find({ user_id: ownerId }).exec();
      return res.status(200).json({ routes });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addScheduleToRoute: async function (req, res) {
    try {
      const {
        routeId,
        scheduleId,
        origin,
        destination,
        start_time,
        end_time,
        available_at,
      } = req.body;

      // Check if the routeId is provided
      if (!routeId) {
        return res
          .status(400)
          .json({ error: "Route ID is missing in the request body." });
      }

      const route = await Route.findById(routeId).exec();

      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }

      if (scheduleId) {
        // If scheduleId is provided, update the existing schedule
        const existingSchedule = await Schedule.findById(scheduleId).exec();

        if (!existingSchedule) {
          return res.status(404).json({ error: "Schedule not found" });
        }

        existingSchedule.origin = origin;
        existingSchedule.destination = destination;
        existingSchedule.start_time = start_time;
        existingSchedule.end_time = end_time;
        existingSchedule.available_at = available_at;

        const updatedSchedule = await existingSchedule.save();
        return res.status(200).json(updatedSchedule);
      } else {
        // Create a new schedule
        const newSchedule = new Schedule({
          route: route._id,
          origin,
          destination,
          start_time,
          end_time,
          available_at,
        });

        const savedSchedule = await newSchedule.save();

        route.schedules.push(savedSchedule._id);
        await route.save();

        return res.status(201).json(savedSchedule);
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = scheduleController;
