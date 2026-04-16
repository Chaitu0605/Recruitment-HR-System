import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function JobDetails() {

  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {

    API.get(`/jobs/${id}`)
      .then(res => setJob(res.data));

  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div>

      <h2>{job.title}</h2>
      <p>{job.company}</p>
      <p>{job.description}</p>

    </div>
  );
}

export default JobDetails;