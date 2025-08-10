// create authRoutes
const express = require("express");
const {
  signup,
  login,
  resetPassword,
  verifyOtpAndResetPassword,
  applyInternship,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/student-controllers/studentController");
const { resumePdfMW } = require("../middlewares/profile");
const router = express.Router();

// =================== START =====================

// auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtpAndResetPassword);
// internship
router.post("/apply-internship", resumePdfMW, applyInternship);
// profile
router.get("/profile/:id", getStudentProfile);
router.put("/update-profile/:id", resumePdfMW, updateStudentProfile);


//==================== END ========================

module.exports = router;
