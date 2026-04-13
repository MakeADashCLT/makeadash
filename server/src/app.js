const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("../config/passport");

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
    },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

module.exports = app;