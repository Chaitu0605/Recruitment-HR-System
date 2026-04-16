import { useState } from "react";
import API from "../services/api";

function ApplyNow() {

  const [form, setForm] = useState({
    jobId: "",
    skills: "",
    certifications: "",
    internships: "",
    education: "",
    experience: ""
  });

  const applyJob = async () => {

    const data = {
      jobId: form.jobId,
      skills: form.skills.split(","),
      certifications: form.certifications.split(","),
      internships: form.internships.split(","),
      education: form.education,
      experience: form.experience
    };

    const token = localStorage.getItem("token");

    await API.post("/applications/apply", data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Application Submitted");

  };

  return (
    <div>

      <h2>Apply Job</h2>

      <input placeholder="Job ID"
        onChange={e => setForm({ ...form, jobId: e.target.value })}
      />

      <input placeholder="Skills (comma separated)"
        onChange={e => setForm({ ...form, skills: e.target.value })}
      />

      <input placeholder="Certifications"
        onChange={e => setForm({ ...form, certifications: e.target.value })}
      />

      <input placeholder="Internships"
        onChange={e => setForm({ ...form, internships: e.target.value })}
      />

      <input placeholder="Education"
        onChange={e => setForm({ ...form, education: e.target.value })}
      />

      <input placeholder="Experience"
        onChange={e => setForm({ ...form, experience: e.target.value })}
      />

      <button onClick={applyJob}>
        Apply
      </button>

    </div>
  );
}

export default ApplyNow;