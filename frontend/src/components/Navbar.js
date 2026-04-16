import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      background: "#111",
      color: "white"
    }}>

      <Link style={{color:"white"}} to="/">Home</Link>
      <Link style={{color:"white"}} to="/jobs">Jobs</Link>
      <Link style={{color:"white"}} to="/apply">Apply</Link>
      <Link style={{color:"white"}} to="/candidate">Candidate</Link>
      <Link style={{color:"white"}} to="/admin">Admin</Link>
      <Link style={{color:"white"}} to="/contact">Contact</Link>

    </nav>
  );
}

export default Navbar;