const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  number: { type: String },
  state: {
    type: String,
    enum: ["available", "booked", "reserved", "no-seat", "disabled"],
  },
});

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
