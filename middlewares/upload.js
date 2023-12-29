const multer = require("multer");

// Configure multer to use memory storage
const storage = multer.memoryStorage();

exports.upload = multer({ storage: storage });
