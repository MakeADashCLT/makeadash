const express = require("express");
const cors = require("cors");

const initDB = require("./db/init");

const usersRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

initDB();

module.exports = app;