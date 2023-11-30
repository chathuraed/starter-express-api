const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  number: { type: String, required: false, default: null },
  state: {
    type: String,
    enum: ["available", "booked", "reserved", "no-seat", "disabled"],
    required: true,
  },
});

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
