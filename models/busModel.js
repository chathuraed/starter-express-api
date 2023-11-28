const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, unique: true, required: true },
    model: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
