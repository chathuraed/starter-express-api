import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  permit_id: {
    type: String,
    unique: true,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schedules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
  ],
});

const Route = mongoose.model("Route", routeSchema);

export default Route;
