const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  changePassword,
  getProfile,
  updateProfile,
} = require("../controllers/institute-controllers/institueController");


router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getProfile);
router.put("/update-profile/:id", updateProfile);
router.post("/change-password/:instituteId", changePassword);

module.exports = router;
