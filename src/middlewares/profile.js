const multer = require("multer");
const path = require("path");

// Resume PDF middleware
const resumePdfMW = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/assets/resumes");
    },
    filename: function (req, file, cb) {
      const now = Date.now();
      cb(null, `${file.fieldname}-${now}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
}).single("resume");

// Internship Image middleware
const internshipImageMW = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/assets/internship");
    },
    filename: function (req, file, cb) {
      const now = Date.now();
      cb(null, `${file.fieldname}-${now}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, JPEG, PNG) are allowed!"), false);
    }
  },
}).single("image");

module.exports = {
  resumePdfMW,
  internshipImageMW
};
