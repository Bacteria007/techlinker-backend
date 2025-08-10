const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
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
router.get("api/instituteSetting/:instituteId", getSettings);
router.post("api/instituteSetting/update/:instituteId", updateSettings);

module.exports = router;
