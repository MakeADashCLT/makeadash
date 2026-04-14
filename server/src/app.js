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
const githubRoutes = require("../routes/github"); 

const app = express();

app.use(cors({
  origin: true,
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
app.use('/api/github', githubRoutes);     

const path = require("path");

// Serve React build
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = app;