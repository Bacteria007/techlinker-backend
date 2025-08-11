const Admin = require("../../models/admins");

// Admin Login (no signup for admin)
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