const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const swaggerUi = require("swagger-ui-express");
const specs = require("./swagger");

//For env File
dotenv.config();

const routes = require("./routes");

const app = express();
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api", routes);

mongoose.set("strictQuery", false);
mongoose
  .connect(
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
