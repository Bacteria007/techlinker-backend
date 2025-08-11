const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  changePassword,
  getProfile,
  updateProfile,
} = require("../controllers/institute-controllers/institueController");
const { institueImageMW } = require("../middlewares/profile");


router.post("/signup",institueImageMW, signup);
router.post("/login", login);
router.get("/:id", getProfile);
router.put("/update-profile/:id", updateProfile);
router.post("/change-password/:instituteId", changePassword);

module.exports = router;
