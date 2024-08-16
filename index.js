const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Bookaroo server");
});

// connect app to the port
app.listen(port, () => {
  console.log(`Bookaroo server running on PORT : ${port}`);
});
