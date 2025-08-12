const Admin = require("../../models/admins");
const Student = require("../../models/students");
const Internship = require("../../models/internships");
const Institute = require("../../models/institutes");

// Admin Login (existing)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
        data: null,
      });
    }

    // Plain text password check
    if (password !== admin.password) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
        data: null,
      });
    }

    // Login successful
    res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      message: "Server error during login",
      success: false,
      data: null,
    });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts for dashboard cards
    const studentsCount = await Student.countDocuments();
    const internshipsCount = await Internship.countDocuments();
    const institutesCount = await Institute.countDocuments();

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      success: true,
      data: {
        students: studentsCount,
        internships: internshipsCount,
        institutes: institutesCount,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      message: "Server error retrieving dashboard statistics",
      success: false,
      data: null,
    });
  }
};

// Get Recent Students (for dashboard preview)
exports.getRecentStudents = async (req, res) => {
  try {
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("name email createdAt");

    res.status(200).json({
      message: "Recent students retrieved successfully",
      success: true,
      data: recentStudents,
    });
  } catch (error) {
    console.error("Recent Students Error:", error);
    res.status(500).json({
      message: "Server error retrieving recent students",
      success: false,
      data: null,
    });
  }
};

// Get Active Internships (for dashboard preview)
exports.getActiveInternships = async (req, res) => {
  try {
    const activeInternships = await Internship.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title type location description createdAt datePosted joblevel deadline")
      .populate("instituteId", "name");

    res.status(200).json({
      message: "Active internships retrieved successfully",
      success: true,
      data: activeInternships,
    });
  } catch (error) {
    console.error("Active Internships Error:", error);
    res.status(500).json({
      message: "Server error retrieving active internships",
      success: false,
      data: null,
    });
  }
};

exports.getPartnerInstitutes = async (req, res) => {
  try {
    // Fetch partner institutes with limited fields, sorted by creation date
    const partnerInstitutes = await Institute.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("name address email createdAt")
      .lean(); // Use lean() for better performance

    // Fetch internship count for each institute
    const institutesWithInternshipCount = await Promise.all(
      partnerInstitutes.map(async (institute) => {
        const internshipCount = await Internship.countDocuments({ instituteId: institute._id });

        return {
          ...institute,
          internshipCount
        };
      })
    );

    res.status(200).json({
      message: "Partner institutes with internship count retrieved successfully",
      success: true,
      data: institutesWithInternshipCount,
    });
  } catch (error) {
    console.error("Partner Institutes Error:", error);
    res.status(500).json({
      message: "Server error retrieving partner institutes",
      success: false,
      data: null,
    });
  }
};


// Get Recent Activity (for dashboard)
exports.getRecentActivity = async (req, res) => {
  try {
    // Get recent students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name email bio createdAt");

    // Get recent internships
    const recentInternships = await Internship.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title type createdAt")
      .populate("instituteId", "name");

    // Get recent institutes
    const recentInstitutes = await Institute.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name address createdAt");

    // Combine and format activities
    const activities = [
      ...recentStudents.map((student) => ({
        type: "student_registered",
        title: "New student registered",
        subtitle: `${student.name} joined ${student.course || "a course"}`,
        time: student.createdAt,
        icon: "person_add",
        color: "#4CAF50",
      })),
      ...recentInternships.map((internship) => ({
        type: "internship_posted",
        title: "Internship posted",
        subtitle: `${internship.title} at ${internship.instituteId?.name || "Unknown Institute"}`,
        time: internship.createdAt,
        icon: "work",
        color: "#2196F3",
      })),
      ...recentInstitutes.map((institute) => ({
        type: "institute_verified",
        title: "Institute verified",
        subtitle: `${institute.name} approved`,
        time: institute.createdAt,
        icon: "business",
        color: "#FF9800",
      })),
    ];

    // Sort by time and limit to 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivities = activities.slice(0, 5);

    res.status(200).json({
      message: "Recent activities retrieved successfully",
      success: true,
      data: recentActivities,
    });
  } catch (error) {
    console.error("Recent Activity Error:", error);
    res.status(500).json({
      message: "Server error retrieving recent activities",
      success: false,
      data: null,
    });
  }
};
