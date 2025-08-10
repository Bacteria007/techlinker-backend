const express = require("express");
const router = express.Router();
const {
  addInternship,
  checkInternships,
  countInternships,
  deleteInternship,
  getActiveMonthInternships,
  getInternships,
  searchInternship,
} = require("../controllers/internship-controllers/internshipController");
const { internshipImageMW } = require("../middlewares/profile");

// 📬 POST
router.post("/add", internshipImageMW, addInternship);

// ✅ GET All internships
router.get("/", getInternships);

// 🗑 DELETE
router.delete("/:id", deleteInternship);

// 🔢 Count
router.get("/count", countInternships);

// ✅ Debug
router.get("/check", checkInternships);

// 📅 Active this month
router.get("/active-month", getActiveMonthInternships);

router.get("/search", searchInternship);

module.exports = router;
