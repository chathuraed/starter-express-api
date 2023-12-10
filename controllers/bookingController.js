const Booking = require("../models/bookingModel");

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const {
        booking_date,
        schedule_id,
        bus_id,
        price_per_seat,
        passenger_id,
        selected_seats,
      } = req.body;

      // Check if seats are already reserved for the same date and schedule
      const existingBooking = await Booking.findOne({
        booking_date,
        schedule_id,
        bus_id,
        "selected_seats.number": {
          $in: selected_seats.map((seat) => seat.number),
        },
      });

      if (existingBooking) {
        return res.status(400).json({
          message:
            "Seats are already reserved for the specified date and schedule",
        });
      }

      // Calculate the total price based on the number of selected seats and the price per seat
      const total_price = selected_seats.length * price_per_seat;

      // If no existing booking, proceed to create a new booking
      const booking = new Booking({
        booking_date,
        schedule_id,
        bus_id,
        price_per_seat,
        passenger_id,
        selected_seats,
        total_price, // Add the calculated total price to the booking
        status: "pending",
      });

      await booking.save();

      return res
        .status(201)
        .json({ message: "Booking created successfully", total_price });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getBookings: async (req, res) => {
    try {
      const { userId } = req.params;

      // Find bookings based on the user ID
      const bookings = await Booking.find({ passenger_id: userId });

      return res.status(200).json({ bookings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = bookingController;
