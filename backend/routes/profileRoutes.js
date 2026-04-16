// File: backend/routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// POST /api/profile/update
// We use 'auth' to ensure they are logged in, and 'upload.single' to catch the resume file
router.post("/update", auth, upload.single("resume"), updateProfile);

module.exports = router;