const bcrypt = require("bcryptjs");
const Institute = require("../../models/institutes");

// Signup
exports.signup = async (req, res) => {
  try {
    const {
      instituteName,
      businessType,
      email,
      password,
      phone,
      city,
      contactPerson,
      address
    } = req.body;

    // Check if email already exists
    const existingInstitute = await Institute.findOne({ email });
    if (existingInstitute) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstitute = new Institute({
      instituteName,
      businessType,
      email,
      password: hashedPassword,
      phone,
      city,
      contactPerson,
      address
    });

    await newInstitute.save();
    res.status(201).json({ message: 'Institute signup successful', institute: newInstitute });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const institute = await Institute.findOne({ email });
    if (!institute) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, institute.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      instituteId: institute._id,
      instituteName: institute.instituteName,
      email: institute.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch profile
exports.getProfile = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }
    res.json({
      name: institute.instituteName,
      email: institute.email,
      phone: institute.phone,
      businessType: institute.businessType,
      city: institute.city,
      contactPerson: institute.contactPerson,
      address: institute.address,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const instituteId = req.params.id;
    const { name, email, phone } = req.body;

    const existing = await Institute.findOne({ email, _id: { $ne: instituteId } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use by another account." });
    }

    const updatedInstitute = await Institute.findByIdAndUpdate(
      instituteId,
      { instituteName: name, email, phone },
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Institute not found." });
    }

    res.json({ message: "Profile updated successfully", updatedInstitute });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const institute = await Institute.findById(req.params.instituteId);

    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, institute.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    institute.password = hashedPassword;
    await institute.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//======== institue settings =========//

// Get institute settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await InstituteSetting.findOne({ instituteId: req.params.instituteId });
    if (!settings) {
      return res.json({
        twoStepVerification: false,
        profileVisibility: true,
        readReceipts: true,
        locationAccess: false,
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching settings", error: err.message });
  }
};

// Update or create institute settings
exports.updateSettings = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.instituteId);
    const { twoStepVerification, profileVisibility, readReceipts, locationAccess } = req.body;
    
    const filter = { instituteId: id };
    const update = { twoStepVerification, profileVisibility, readReceipts, locationAccess };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const settings = await InstituteSetting.findOneAndUpdate(filter, update, options);
    res.json({ message: "Settings updated successfully", settings });
  } catch (err) {
    res.status(500).json({ message: "Error updating settings", error: err.message });
  }
};
