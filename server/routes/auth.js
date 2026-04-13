const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL); // Redirect to frontend
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;