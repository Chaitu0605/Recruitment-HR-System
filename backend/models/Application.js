const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    coverLetter: { type: String },
    resume: { type: String, required: true }, // Path to the uploaded file
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Interview Scheduled", "Rejected", "Hired"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);