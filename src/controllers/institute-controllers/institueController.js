const bcrypt = require("bcryptjs");
const Institute = require("../../models/institutes");

// 📌 Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, website, about, address } = req.body;
    console.log(name, email, password, phone, website, about, address );
    // Check if email already exists
    const existingInstitute = await Institute.findOne({ email });
    if (existingInstitute) {
      return res.status(400).json({
        message: "Email already registered",
        success: false,
      });
    }

       if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        success: false,
        data: null
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format",
        success: false,
        data: null
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters",
        success: false,
        data: null
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstitute = new Institute({
      name,
      website,
      email,
      password: hashedPassword,
      phone,
      about,
      address,
    });
    await newInstitute.save();
    const instituteData = newInstitute.toObject();
    delete instituteData.password;
    res.status(201).json({
      message: "Institute signup successful",
      data: instituteData,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// 📌 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const institute = await Institute.findOne({ email });

    if (!institute) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, institute.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const { password: _, ...instituteData } = institute.toObject(); // remove password

    res.json({
      message: "Login successful",
      data: instituteData,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// 📌 Fetch profile
exports.getProfile = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).select(
      "-password"
    );
    if (!institute) {
      return res.status(404).json({
        message: "Institute not found",
        success: false,
      });
    }
    res.json({
      message: "Profile fetched successfully",
      data: institute,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      success: false,
    });
  }
};

// 📌 Update profile
exports.updateProfile = async (req, res) => {
  try {
    const instituteId = req.params.id;
    const { name, email, phone } = req.body;

    const existing = await Institute.findOne({
      email,
      _id: { $ne: instituteId },
    });
    if (existing) {
      return res.status(400).json({
        message: "Email already in use by another account.",
        success: false,
      });
    }

    const updatedInstitute = await Institute.findByIdAndUpdate(
      instituteId,
      { name, email, phone },
      { new: true, select: "-password" }
    );

    if (!updatedInstitute) {
      return res.status(404).json({
        message: "Institute not found.",
        success: false,
      });
    }

    res.json({
      message: "Profile updated successfully",
      data: updatedInstitute,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// 📌 Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const institute = await Institute.findById(req.params.instituteId);

    if (!institute) {
      return res.status(404).json({
        message: "Institute not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, institute.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    institute.password = hashedPassword;
    await institute.save();

    res.json({
      message: "Password changed successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
