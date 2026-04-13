const express = require("express");
const router = express.Router();

// current user
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ user: null });
  }

  res.json(req.user);
});

module.exports = router;