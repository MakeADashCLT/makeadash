const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("../config/passport"); // Load Passport config

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");

const app = express();

// Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

module.exports = app;