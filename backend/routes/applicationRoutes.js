const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Ensure you have this middleware for resume uploads

// Import ALL functions perfectly synced with the controller
const { 
  submitApplication, 
  getMyApplications, 
  getApplicationsByJob, 
  getAllApplications, 
  updateApplicationStatus 
} = require("../controllers/applicationController");

// Define the routes
router.post("/apply", auth, upload.single("resume"), submitApplication);
router.get("/my-applications", auth, getMyApplications);
router.get("/job/:jobId", auth, getApplicationsByJob);
router.get("/", auth, getAllApplications);
router.put("/:id", auth, updateApplicationStatus);

module.exports = router;