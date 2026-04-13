const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);

// Get current logged-in user
router.get("/me", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;