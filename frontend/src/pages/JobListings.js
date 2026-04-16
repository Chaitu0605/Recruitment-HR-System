import React,{useState} from "react"
import API from "../services/api"

const JobListings = () => {

  const [skills,setSkills] = useState("")
  const [jobs,setJobs] = useState([])

  const findJobs = async () => {

    const skillArray = skills.split(",").map(s=>s.trim())

    const res = await API.post("/jobs/recommend",{
      skills:skillArray
    })

    setJobs(res.data)

  }

  return(

    <div>

      <h2>AI Job Recommendation</h2>

      <input
        value={skills}
        onChange={(e)=>setSkills(e.target.value)}
        placeholder="React,Node.js"
      />

      <button onClick={findJobs}>
        Find Jobs
      </button>


      {jobs.map(job=>(

        <div key={job._id}
        style={{
          border:"1px solid gray",
          margin:"10px",
          padding:"10px"
        }}>

          <h3>{job.title}</h3>

          <p>{job.company}</p>

          <p>{job.location}</p>

          <p>
            Required Skills:
            {job.requiredSkills.join(", ")}
          </p>

          <p>
            AI Match Score:
            {job.matchScore}%
          </p>

          <button
          onClick={()=>window.open(job.jobLink,"_blank")}
          >
            Apply
          </button>

        </div>

      ))}

    </div>

  )

}

export default JobListings