import { Link } from "react-router-dom";

function JobCard({ job }) {

  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.location}</p>

      <Link to={`/job/${job._id}`}>
        View Details
      </Link>
    </div>
  );
}

export default JobCard;