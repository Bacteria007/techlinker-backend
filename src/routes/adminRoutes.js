const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/admin-controllers/adminController");

// Admin Signup
router.post("/signup", signup);

// Admin Login
router.post("/login", login);

module.exports = router;
