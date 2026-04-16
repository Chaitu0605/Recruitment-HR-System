const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Job Seeker", "Recruiter", "HR Administrator", "System Admin"],
      default: "Job Seeker",
    },
    // New Profile Fields:
    skills: [String],
    resume: String, 
    cgpa: Number,
    projects: String,
    gtrcScore: Number,       // For the AI generated score
    learningRoadmap: String  // For the AI generated learning path
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);