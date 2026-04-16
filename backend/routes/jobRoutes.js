const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Import all functions perfectly synced with the controller
const { 
  createJob, 
  getJobs, 
  getJobById, 
  generateJobsWithAI 
} = require("../controllers/jobController");

// Define routes
router.post("/", auth, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);

// The AI Demo Route (No 'auth' block so it fires instantly for your demo)
router.post("/generate-ai", generateJobsWithAI);

module.exports = router;