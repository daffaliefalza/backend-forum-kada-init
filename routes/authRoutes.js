const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  googleLogin,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

// Register
router.post("/register", register);

// login
router.post("/login", login);

// Get Current Profile
router.get("/me", protect, getMe);

// Logout
router.post("/logout", logout);

// Google OAuth
router.post("/google", googleLogin);

module.exports = router;
