const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//For env File
dotenv.config();

const routes = require("./routes");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api", routes);

mongoose.set("strictQuery", false);
mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@seatwise-asia.itrp5fp.mongodb.net/seatwise-api?retryWrites=true&w=majority`
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@seatwise-cluster.ehkrxxf.mongodb.net/seatwise-api?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error.bind(console, "MongoDB connection error:");
  });
