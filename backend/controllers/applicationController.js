const Application = require("../models/Application");
const nodemailer = require("nodemailer");

// 1. Submit a New Application (Candidate)
exports.submitApplication = async (req, res) => {
  try {
    const newApp = new Application({
      jobId: req.body.jobId,
      userId: req.user.id,
      coverLetter: req.body.coverLetter,
      resume: req.file ? req.file.path : ""
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get Applications for Logged-In User (Candidate Dashboard)
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).populate('jobId', 'title company');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Applications by Specific Job ID 
exports.getApplicationsByJob = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name email');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get ALL Applications (Admin Dashboard)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email gtrcScore')
      .populate('jobId', 'title company');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Update Status & Send Email (Admin Dashboard)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, email, name } = req.body;
    
    // Update the database
    const application = await Application.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );

    // Send the Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email || "test@test.com", 
      subject: `Update on your application with LEORAA & CO.`,
      text: `Hello ${name || 'Candidate'},\n\nYour application status has been updated to: ${status}.\n\nBest regards,\nHR Team`,
    };

    transporter.sendMail(mailOptions).catch(err => console.log("Email skipped (Setup .env to activate):", err.message));

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};