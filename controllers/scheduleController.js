const Route = require("../models/routeModel");
const Schedule = require("../models/scheduleModel");

const getDayOfWeek = (dateString) => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const [day, month, year] = dateString.split("-");
  const date = new Date(`${month}/${day}/${year}`);
  const dayOfWeek = date.getDay();
  return daysOfWeek[dayOfWeek];
};

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
  findSchedules: async function (req, res) {
    try {
      const { date, from, to } = req.body;

      if (!date || !from || !to) {
        return res.status(400).json({
          error: "Date, Origin and Destination are required.",
        });
      }

      const dayOfWeek = getDayOfWeek(date.toLowerCase());

      const schedules = await Schedule.find({
        origin: from.id,
        destination: to.id,
        available_at: dayOfWeek,
      }).populate({
        path: "route",
        populate: {
          path: "bus", // Populate the 'bus' field in the 'route' object
        },
      });

      if (schedules.length > 0) {
        return res.status(200).json({ schedules });
      } else {
        return res
          .status(404)
          .json({ message: "No schedules available for the given criteria." });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = scheduleController;
