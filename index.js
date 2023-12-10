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

    // Create an HTTP server
    const server = http.createServer(app);

    // Create a WebSocket server
    const wss = new WebSocket.Server({ server });

    // WebSocket connection handling
    wss.on("connection", (ws) => {
      console.log("WebSocket connection established");

      // Handle messages from the client
      ws.on("message", async (message) => {
        console.log("WebSocket message received:", message);

        try {
          const data = JSON.parse(message);
          switch (data.type) {
            case "initial_data":
              const { booking_date, schedule_id, bus_id } = data.data;

              const allSeats = await Booking.find({
                booking_date,
                schedule_id,
                bus_id,
              });

              const allBookedSeats = allSeats.reduce(
                (seats, booking) => seats.concat(booking.selected_seats),
                []
              );

              console.log("Merged booked seats:", allBookedSeats);

              ws.send(
                JSON.stringify({
                  type: "booked_seats",
                  data: allBookedSeats,
                })
              );
              break;

            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error.message);
        }
      });

      ws.on("close", () => {
        console.log("WebSocket connection closed");
      });
    });

    server.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error.bind(console, "MongoDB connection error:");
  });
