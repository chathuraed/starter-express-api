const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const http = require("http");
const WebSocket = require("ws");

dotenv.config();

const port = process.env.PORT || 8000;

const specs = require("./swagger");
const routes = require("./routes");
const Booking = require("./models/bookingModel");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", routes);

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@seatwise-cluster.ehkrxxf.mongodb.net/seatwise-api?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB");

    const subscribers = new Map();

    // Create an HTTP server
    const server = http.createServer(app);

    // Create a WebSocket server
    const wss = new WebSocket.Server({ server });

    // WebSocket connection handling
    wss.on("connection", (ws) => {
      console.log("WebSocket connection established");

      // Initialize user-specific subscriptions
      const userSubscriptions = new Set();

      // Handle messages from the client
      ws.on("message", async (message) => {
        console.log("WebSocket message received:", message);

        try {
          // Parse the received JSON message
          const data = JSON.parse(message);

          // Check the type of the message
          switch (data.type) {
            case "subscribe":
              // Extract relevant data from the message
              const { booking_date, schedule_id, bus_id } = data.data;

              // Create a key for the Map to identify this subscription
              const key = `${booking_date}/${schedule_id}/${bus_id}`;

              // Add WebSocket connection to subscribers Map
              if (!subscribers.has(key)) {
                subscribers.set(key, new Set());
              }
              subscribers.get(key).add(ws);

              // Add the key to the user's individual subscriptions
              userSubscriptions.add(key);

              // Example: Send a subscription acknowledgment back to the client
              ws.send(
                JSON.stringify({
                  type: "subscription_ack",
                  message: "Subscribed successfully.",
                })
              );
              break;

            // Add more cases for other message types if needed

            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error.message);
        }
      });

      // Connection closed
      ws.on("close", () => {
        console.log("WebSocket connection closed");

        // Remove the user's subscriptions when the connection is closed
        userSubscriptions.forEach((key) => {
          if (subscribers.has(key)) {
            subscribers.get(key).delete(ws);
            if (subscribers.get(key).size === 0) {
              subscribers.delete(key);
            }
          }
        });
      });
    });

    // Logic to send updates to subscribers
    const sendUpdatesToSubscribers = (key, bookedSeats) => {
      if (subscribers.has(key)) {
        const subscribersForThisKey = subscribers.get(key);
        const message = JSON.stringify({
          type: "booked_seats",
          data: bookedSeats,
        });

        // Send updates to all subscribers for this key
        subscribersForThisKey.forEach((subscriber) => {
          subscriber.send(message);
        });
      }
    };

    // Sample logic (replace this with your actual logic to get booking updates)
    setInterval(async () => {
      try {
        // Iterate over each subscription and fetch data for each one
        for (const [key, subscribersForThisKey] of subscribers.entries()) {
          const [booking_date, schedule_id, bus_id] = key.split("/");

          // Replace this with actual logic to fetch booking data from your database
          const bookings = await Booking.find({
            booking_date,
            schedule_id,
            bus_id,
          });

          const allBookedSeats = bookings.reduce(
            (seats, booking) => seats.concat(booking.selected_seats),
            []
          );

          // Send updates to all subscribers for this key
          const message = JSON.stringify({
            type: "booked_seats",
            data: allBookedSeats,
          });

          // Send updates to all subscribers for this key
          subscribersForThisKey.forEach((subscriber) => {
            subscriber.send(message);
          });
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    }, 5000); // Repeat every 5 seconds (adjust as needed)

    // Start the server
    server.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error.bind(console, "MongoDB connection error:");
  });
