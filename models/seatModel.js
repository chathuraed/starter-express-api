const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, unique: true, required: true },
  status: { type: String, enum: ["available", "booked", "reserved",], default: "available" },
});

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;