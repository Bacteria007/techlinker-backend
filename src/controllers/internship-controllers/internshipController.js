const Internship = require("../../models/internships");

// 📬 POST: Add internship
exports.addInternship = async (req, res) => {
  try {
    const { title, location, description, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Save full file path (adjust based on your folder structure)
    const filePath = `/uploads/internship/${req.file.filename}`;

    const newInternship = new Internship({
      title,
      location,
      description,
      type,
      image: filePath
    });

    await newInternship.save();

    const count = await Internship.countDocuments();
    res.status(201).json({
      message: "Internship posted successfully",
      count
    });
  } catch (error) {
    console.error("Error adding internship:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET: All internships (with optional limit)
exports.getInternships = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const internships = limit > 0
      ? await Internship.find().sort({ createdAt: -1 }).limit(limit)
      : await Internship.find().sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch internships", error: error.message });
  }
};

// 🗑 DELETE: Internship by ID
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    const count = await Internship.countDocuments();

    res.json({ message: "Internship deleted successfully", count });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting internship" });
  }
};

// 🔢 Count internships
exports.countInternships = async (req, res) => {
  try {
    const count = await Internship.countDocuments();
    res.json({ count: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Debug route
exports.checkInternships = async (req, res) => {
  try {
    const data = await Internship.find();
    res.json({ total: data.length, internships: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📅 Active internships this month
exports.getActiveMonthInternships = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const activeInternships = await Internship.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ createdAt: -1 });

    res.status(200).json(activeInternships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active internships", error: error.message });
  }
};

// search internship by title or location or type 
exports.searchInternship = async (req, res) => {
  try {
    const { query } = req.query; // Get the single search string

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    const internships = await Internship.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (err) {
    console.error("Error searching internships:", err);
    res.status(500).json({
      success: false,
      message: "Server error while searching internships",
    });
  }
}
