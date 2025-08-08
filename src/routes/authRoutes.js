// create authRoutes
const express=require('express')
const router = express.Router();
const {
  signup,
  login,
  resetPassword,
  verifyOtpAndResetPassword,
} = require("../controllers/auth-controllers/auth-controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtpAndResetPassword);
module.exports = router;
