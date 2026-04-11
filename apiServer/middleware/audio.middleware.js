const multer = require("multer");

// 🔥 Store in RAM instead of disk
const storage = multer.memoryStorage();

// 🔒 Allow only audio files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files allowed"), false);
  }
};

const audio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = audio;