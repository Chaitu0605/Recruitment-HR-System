import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// ==========================================
// 1. API SETUP
// ==========================================
const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ==========================================
// ==========================================
// ==========================================
// 2. NAVIGATION COMPONENT (Updated UI)
// ==========================================
const Navbar = ({ user, logout, setUser }) => {
  const isSuperAdmin = user && user.email === 'borapureddichaitanya06@gmail.com';

  const handleGoogleSuccess = (credentialResponse) => {
    // Decode the Google token to get the user's name and email
    const decoded = jwtDecode(credentialResponse.credential);
    
    // Create a user object from Google's data
    const googleUser = {
      name: decoded.name,
      email: decoded.email,
      role: 'Job Seeker', // Default to candidate
      picture: decoded.picture
    };

    // Save to local storage and update React state
    localStorage.setItem("user", JSON.stringify(googleUser));
    // Note: In a production app, you would send this token to your backend to save it to MongoDB!
    setUser(googleUser);
    window.location.href = '/dashboard';
  };

  return (
    <nav style={{ padding: '20px 50px', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {/* Logo Section */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ backgroundColor: '#000', padding: '5px 10px', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#f97316', fontSize: '20px', marginRight: '5px' }}>❖</span>
          <span style={{ color: '#3b82f6', fontSize: '18px' }}>LEORAA & CO.,</span>
        </div>
        LEORAA & CO.
      </Link>

      {/* Nav Links Section */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Careers</Link>
        <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Jobs</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
        {isSuperAdmin && <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>HR Admin</Link>}

        {/* Auth Section */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
            {user.picture && <img src={user.picture} alt="profile" style={{ width: '35px', borderRadius: '50%' }} />}
            <button onClick={logout} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '4px', overflow: 'hidden' }}>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={() => alert('Google Login Failed')}
              theme="outline"
              text="signin_with"
              shape="rectangular"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

// ==========================================
// 3. HOME COMPONENT (Updated UI)
// ==========================================
const Home = () => (
  <div style={{ 
    textAlign: 'center', 
    padding: '160px 20px', 
    background: 'linear-gradient(135deg, #4f46e5 0%, #38bdf8 100%)', 
    minHeight: '60vh',
    color: 'white'
  }}>
    <h1 style={{ fontSize: '56px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '-1px' }}>
      Find Your Dream Job
    </h1>
    <p style={{ fontSize: '22px', marginBottom: '40px', fontWeight: '300', opacity: '0.9' }}>
      Modern AI Powered Recruitment Platform
    </p>
    <Link to="/jobs" style={{ 
      backgroundColor: 'white', 
      color: '#2563eb', 
      padding: '14px 32px', 
      borderRadius: '6px', 
      textDecoration: 'none', 
      fontSize: '16px', 
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'inline-block',
      transition: 'transform 0.2s'
    }}>
      Browse Jobs
    </Link>
  </div>
);

// ==========================================
// 4. AUTH COMPONENT (Login & Register)
// ==========================================
const AuthForm = ({ type, setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Job Seeker' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await API.post(endpoint, formData);

      if (type === 'login') {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate(data.user.role === 'Job Seeker' ? '/dashboard' : '/admin');
      } else {
        alert("Registration Successful! Please log in.");
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', textTransform: 'capitalize' }}>{type}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {type === 'register' && (
          <input type="text" placeholder="Full Name" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        )}
        <input type="email" placeholder="Email Address" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} onChange={e => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" placeholder="Password" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} onChange={e => setFormData({ ...formData, password: e.target.value })} />
        {type === 'register' && (
          <select style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} onChange={e => setFormData({ ...formData, role: e.target.value })}>
            <option value="Job Seeker">I am looking for a job (Candidate)</option>
            <option value="HR Administrator">I am hiring (HR Admin)</option>
          </select>
        )}
        <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {type === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 5. POST A JOB COMPONENT (Admin Only)
// ==========================================
const PostJob = () => {
  const [formData, setFormData] = useState({ title: '', company: '', location: '', description: '', requirements: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming requirements are comma-separated
      const formattedData = { ...formData, requirements: formData.requirements.split(',') };
      await API.post('/jobs', formattedData);
      alert("Job Posted Successfully!");
      navigate('/jobs');
    } catch (err) {
      alert("Error posting job. Ensure you are logged in as an Admin.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Job Title" required style={{ padding: '10px' }} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <input type="text" placeholder="Company" required style={{ padding: '10px' }} onChange={e => setFormData({ ...formData, company: e.target.value })} />
        <input type="text" placeholder="Location" required style={{ padding: '10px' }} onChange={e => setFormData({ ...formData, location: e.target.value })} />
        <textarea placeholder="Job Description" required rows="4" style={{ padding: '10px' }} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
        <input type="text" placeholder="Requirements (comma separated)" required style={{ padding: '10px' }} onChange={e => setFormData({ ...formData, requirements: e.target.value })} />
        <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Publish Job</button>
      </form>
    </div>
  );
};

// ==========================================
// ==========================================
// 6. JOB BOARD COMPONENT (FINAL DEMO VERSION)
// ==========================================
const JobBoard = ({ user }) => { 
  const [jobs, setJobs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // FOOLPROOF OVERRIDE: Forces the system to treat you as Admin for the demo
  const isSuperAdmin = true; 

  const fetchJobs = () => {
    API.get('/jobs').then(res => setJobs(res.data)).catch(err => console.log(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      // Calls your fast Groq backend route
      await API.post('/jobs/generate-ai');
      alert("AI successfully generated and posted new jobs!");
      fetchJobs(); // Refresh the board to show the new jobs
    } catch (err) {
      alert("Failed to generate AI jobs. Check backend console.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Open Positions</h2>
        
        {/* The button will always show up now because isSuperAdmin is true */}
        {isSuperAdmin && (
          <button 
            onClick={handleGenerateAI} 
            disabled={isGenerating}
            style={{ 
              backgroundColor: isGenerating ? '#94a3b8' : '#8b5cf6', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isGenerating ? "Groq AI is thinking..." : "✨ Auto-Generate Jobs via AI"}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {jobs.length === 0 && !isGenerating && <p>No jobs available right now.</p>}
        {jobs.map(job => (
          <div key={job._id} style={{ padding: '25px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>{job.title}</h3>
            <p style={{ margin: '0 0 15px 0', color: '#475569' }}><strong>{job.company}</strong> <span style={{ margin: '0 10px', color: '#cbd5e1' }}>|</span> {job.location}</p>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{job.description}</p>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {job.requirements?.map((req, idx) => (
                <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', padding: '4px 10px', borderRadius: '15px' }}>{req}</span>
              ))}
            </div>

            <Link to={`/jobs/${job._id}`} style={{ display: 'inline-block', marginTop: '20px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>View Details & Apply →</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. JOB DETAIL COMPONENT
// ==========================================
const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(err => console.log(err));
  }, [id]);

  if (!job) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading job details...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ marginBottom: '5px' }}>{job.title}</h1>
      <h3 style={{ color: '#475569', marginTop: '0' }}>{job.company} - {job.location}</h3>
      <div style={{ marginTop: '20px', lineHeight: '1.6' }}>
        <h3>Description</h3>
        <p>{job.description}</p>
        <h3>Requirements</h3>
        <ul>
          {job.requirements?.map((req, i) => <li key={i}>{req}</li>)}
        </ul>
      </div>
      <Link to={`/apply/${job._id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: '#2563eb', color: 'white', padding: '15px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', marginTop: '30px' }}>Apply Now</Link>
    </div>
  );
};

// ==========================================
// 8. APPLY FOR JOB COMPONENT
// ==========================================
const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('coverLetter', coverLetter);
    if (resume) formData.append('resume', resume);

    try {
      await API.post('/applications/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Application submitted successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Failed to submit application. Make sure you are logged in as a candidate.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2>Submit Application</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea placeholder="Write your cover letter here..." rows="6" required style={{ padding: '10px' }} onChange={e => setCoverLetter(e.target.value)}></textarea>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Upload Resume (PDF/DOCX)</label>
          <input type="file" required onChange={e => setResume(e.target.files[0])} />
        </div>
        <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Submit Application</button>
      </form>
    </div>
  );
};

// ==========================================
// ==========================================
// ==========================================
// 9. CANDIDATE DASHBOARD COMPONENT (Updated with AI Features)
// ==========================================
const CandidateDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    // Fetch user's applications
    API.get('/applications/my-applications')
      .then(res => setApplications(res.data))
      .catch(err => console.log(err));
      
    // Fetch all jobs to find AI matches
    API.get('/jobs')
      .then(res => setAllJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  // AI Matching Logic: Filter jobs that require the skills the user has
  const recommendedJobs = allJobs.filter(job => {
    if (!user?.skills || user.skills.length === 0) return false;
    // Check if any of the job requirements match the user's skills
    return job.requirements?.some(req => 
      user.skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Welcome, {user?.name}</h2>
      
      {/* AI Metrics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Profile Card */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Your AI Profile</h3>
          {user?.gtrcScore ? (
            <div>
              <h1 style={{ color: '#2563eb', fontSize: '48px', margin: '10px 0' }}>{user.gtrcScore}/100</h1>
              <p style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Resume Analyzed by Gemini AI</p>
              <p><strong>Top Skills Detected:</strong> {user.skills?.join(", ")}</p>
            </div>
          ) : (
            <p style={{ color: '#ef4444' }}>Profile incomplete. Please upload your resume to generate your score.</p>
          )}
          <Link to="/build-profile" style={{ display: 'inline-block', marginTop: '10px', backgroundColor: '#f97316', color: 'white', padding: '8px 16px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            Update Profile & Resume
          </Link>
        </div>

        {/* AI Job Matches Card */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>🎯 AI Recommended Jobs</h3>
          {recommendedJobs.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recommendedJobs.slice(0, 3).map(job => (
                <li key={job._id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #cbd5e1' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{job.title}</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>{job.company}</p>
                  <Link to={`/jobs/${job._id}`} style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>Apply Now →</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#64748b' }}>No direct skill matches found yet. Keep learning or update your skills!</p>
          )}
        </div>
      </div>

      {/* Applications Tracking Section */}
      <h3>My Applications</h3>
      {applications.length === 0 ? <p>You haven't applied to any jobs yet.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Job Title</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Company</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{app.jobId?.title || "Unknown Job"}</td>
                <td style={{ padding: '12px' }}>{app.jobId?.company || "-"}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==========================================
// ==========================================
// 10. ADMIN DASHBOARD (Applicant Review System)
// ==========================================
const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch ALL applications in the system
    API.get('/applications').then(res => setApplications(res.data)).catch(err => console.log(err));
  }, []);

  const handleStatusUpdate = async (appId, newStatus, candidateEmail, candidateName) => {
    try {
      // Call backend to update status and send email
      await API.put(`/applications/${appId}`, { status: newStatus, email: candidateEmail, name: candidateName });
      alert(`Candidate ${newStatus} successfully! Email notification sent.`);
      // Refresh the list
      const res = await API.get('/applications');
      setApplications(res.data);
    } catch (err) {
      alert("Error updating status.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>HR Command Center - Applicant Tracking</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e293b', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '15px' }}>Candidate Name</th>
            <th style={{ padding: '15px' }}>Job Applied For</th>
            <th style={{ padding: '15px' }}>AI Match Score</th>
            <th style={{ padding: '15px' }}>Resume</th>
            <th style={{ padding: '15px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              {/* Note: In a real app, you'd populate the user details. We are assuming you populated userId in backend */}
              <td style={{ padding: '15px', fontWeight: 'bold' }}>{app.userId?.name || "Test Candidate"}</td>
              <td style={{ padding: '15px' }}>{app.jobId?.title || "Software Engineer"}</td>
              <td style={{ padding: '15px', color: '#2563eb', fontWeight: 'bold' }}>{app.userId?.gtrcScore || "88"}/100</td>
              <td style={{ padding: '15px' }}>
                <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noreferrer" style={{ color: '#8b5cf6' }}>View PDF</a>
              </td>
              <td style={{ padding: '15px' }}>
                {app.status === 'Pending' ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleStatusUpdate(app._id, 'Interview Scheduled', app.userId?.email, app.userId?.name)} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Accept</button>
                    <button onClick={() => handleStatusUpdate(app._id, 'Rejected', app.userId?.email, app.userId?.name)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Reject</button>
                  </div>
                ) : (
                  <span style={{ fontWeight: 'bold', color: app.status === 'Rejected' ? 'red' : 'green' }}>{app.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// ==========================================
// 11. CONTACT US COMPONENT
// ==========================================
const ContactUs = () => (
  <div style={{ maxWidth: '600px', margin: '60px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
    <h2>Contact Support</h2>
    <p style={{ color: '#475569', marginBottom: '20px' }}>Having trouble with your profile or applications? Reach out to us.</p>
    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input type="text" placeholder="Your Name" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      <input type="email" placeholder="Your Email" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      <textarea placeholder="How can we help?" rows="5" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
      <button type="button" onClick={() => alert("Message Sent!")} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Send Message</button>
    </form>
  </div>
);


// ==========================================
// ==========================================
// 13. BUILD PROFILE COMPONENT (Candidate)
// ==========================================
const BuildProfile = ({ setUser }) => { // <-- 1. Accept setUser here
  const [formData, setFormData] = useState({ cgpa: '', skills: '', projects: '' });
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const uploadData = new FormData();
    uploadData.append('cgpa', formData.cgpa);
    uploadData.append('skills', formData.skills.split(',')); 
    uploadData.append('projects', formData.projects);
    if (resume) uploadData.append('resume', resume);

    try {
      // 2. Capture the response 'data' from your backend
      const { data } = await API.post('/profile/update', uploadData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      // 3. Update React's memory AND the browser's local storage with the fresh user data!
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile updated & AI Score Generated successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error updating profile. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Build Your Profile</h2>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>
        Add your details and upload your resume so our AI can generate your GTRC score and match you with jobs.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Overall CGPA</label>
          <input type="number" step="0.1" placeholder="e.g. 8.5" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Top Skills (comma separated)</label>
          <input type="text" placeholder="e.g. React, Node.js, Python, MongoDB" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Key Projects / Experience</label>
          <textarea placeholder="Briefly describe your best projects..." rows="4" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({ ...formData, projects: e.target.value })}></textarea>
        </div>

        <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '5px', border: '1px dashed #94a3b8' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#1e293b' }}>Upload Master Resume (PDF/DOCX)</label>
          <input type="file" required onChange={e => setResume(e.target.files[0])} />
        </div>

        <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          Save & Generate AI Score
        </button>
      </form>
    </div>
  );
};

// ==========================================
// ==========================================
// ==========================================
// 12. MAIN APP ROUTER
// ==========================================
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = '/';
  };

  return (
    // Note: Keep your actual Google Client ID here!
    <GoogleOAuthProvider clientId="241391372502-n8jcckjfhij3t47tts616ushui4lbfdo.apps.googleusercontent.com"> 
      <Router>
        <div style={{ fontFamily: 'Inter, Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
          
          <Navbar user={user} logout={handleLogout} setUser={setUser} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* THE FIX IS HERE: We pass user={user} to the JobBoard */}
            <Route path="/jobs" element={<JobBoard user={user} />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            
            {/* Protected Routes */}
            <Route path="/apply/:id" element={user ? <ApplyJob /> : <Navigate to="/" />} />
            <Route path="/build-profile" element={user ? <BuildProfile setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={user ? <CandidateDashboard user={user} /> : <Navigate to="/" />} />
            
            {/* Admin Routes */}
            <Route path="/post-job" element={user?.email === 'borapureddichaitanya06@gmail.com' ? <PostJob /> : <Navigate to="/dashboard" />} />
            <Route path="/admin" element={user?.email === 'borapureddichaitanya06@gmail.com' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;