// File: backend/controllers/profileController.js
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { cgpa, skills, projects } = req.body;
    const resumePath = req.file ? req.file.path : "";

    // IMPORTANT: This is where you will eventually call your Gemini API.
    // For right now, we will generate a mock AI score so you can test the flow!
    const mockGtrcScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75; 

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        cgpa: parseFloat(cgpa),
        skills: skills, // Frontend already sends this as an array now
        projects: projects,
        gtrcScore: mockGtrcScore,
        ...(resumePath && { resume: resumePath }) // Only update resume if a new one is uploaded
      },
      { new: true } // Return the updated user document
    );

    res.status(200).json({ 
      message: "Profile updated successfully!", 
      user: updatedUser 
    });

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: "Failed to update profile on the server." });
  }
};