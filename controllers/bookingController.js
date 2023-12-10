const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const Route = require("../models/routeModel");
const Schedule = require("../models/scheduleModel");

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
      const userId = req.userId;

      const bookings = await Booking.find({ passenger_id: userId });

      const populatedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const schedule = await Schedule.findById(booking.schedule_id);
          const route = await Route.findById(schedule.route).populate("bus");

          return {
            _id: booking._id,
            booking_date: booking.booking_date,
            schedule: {
              _id: schedule._id,
              origin: schedule.origin,
              destination: schedule.destination,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              available_at: schedule.available_at,
            },
            route,
            price_per_seat: booking.price_per_seat,
            passenger_id: booking.passenger_id,
            selected_seats: booking.selected_seats,
            total_price: booking.total_price,
            status: booking.status,
            // Include other booking fields as needed
          };
        })
      );

      return res.status(200).json({ bookings: populatedBookings });
    } catch (error) {
      console.error("Error in getBookings:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getBookingsByOwner: async (req, res) => {
    try {
      const userId = req.userId;
      const { date } = req.body;

      const buses = await Bus.find({ user_id: userId }).populate({
        path: "route",
        populate: {
          path: "schedules",
        },
      });

      const scheduleIds = buses.reduce((acc, bus) => {
        if (bus.route && bus.route.schedules) {
          const schedules = bus.route.schedules.map((schedule) => schedule._id);
          acc.push(...schedules);
        }
        return acc;
      }, []);

      // Now 'scheduleIds' contains all the schedule IDs from buses associated with the user
      console.log("Schedule IDs:", scheduleIds);

      // You can use the scheduleIds array to find bookings with those schedule IDs
      const bookings = await Booking.find({
        schedule_id: { $in: scheduleIds },
        booking_date: date,
      });

      return res.status(200).json({ bookings: bookings });
    } catch (error) {
      console.error("Error in getBookings:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = bookingController;
