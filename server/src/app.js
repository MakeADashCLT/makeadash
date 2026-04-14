const express = require("express");
const session = require("express-session");
//const passport = require("passport");
//require("../config/passport"); // Load Passport config

const cors = require("cors");

//const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");
const weatherRoutes = require('../routes/weather');
const steamRoutes = require("../routes/steam");
const anilistRoutes = require("../routes/anilist");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
//app.use(passport.initialize());
//app.use(passport.session());

// Routes
//app.use("/auth", authRoutes);

app.use("/users", userRoutes);
app.use('/api/weather', weatherRoutes);
app.use("/api/steam", steamRoutes);
app.use("/api/anilist", anilistRoutes);

module.exports = app;