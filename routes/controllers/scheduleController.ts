import Route from "../../models/routeModel";
import Schedule from "../../models/scheduleModel";
import User from "../../models/userModel";

const scheduleController = {
  listSchedules: async (req: any, res: any) => {
    try {
      const ownerId = req.userId;
      const routes = await Schedule.find({ user_id: ownerId }).exec();
      return res.status(200).json({ routes });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addScheduleToRoute: async (req: any, res: any) => {
    try {
      const {
        routeId,
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
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default scheduleController;
