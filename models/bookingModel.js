const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  booking_date: {
    type: Date,
    required: true,
  },
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  price_per_seat: {
    type: Number,
    required: true,
  },
  passenger_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  selected_seats: [
    {
      number: String,
      rowIndex: Number,
      seatIndex: Number,
    },
  ],
  total_price: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
