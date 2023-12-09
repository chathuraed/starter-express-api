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
      ws.on("message", (message) => {
        console.log("WebSocket message received:", message);
        // Handle the received message as needed

        // Example: Send a response back to the client
        ws.send("Hello from the server!");
      });

      // Connection closed
      ws.on("close", () => {
        console.log("WebSocket connection closed");
      });
    });

    // Start the server
    server.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error.bind(console, "MongoDB connection error:");
  });
