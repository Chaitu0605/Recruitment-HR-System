import {useEffect,useState} from "react"
import API from "../services/api"

function AdminDashboard(){

const [apps,setApps] = useState([])

useEffect(()=>{

API.get("/applications")
.then(res=>setApps(res.data))

},[])

return(

<div style={{padding:"20px"}}>

<h2>AI Candidate Ranking</h2>

{apps.map(app=>(

<div key={app._id}
style={{
border:"1px solid gray",
margin:"10px",
padding:"10px"
}}>

<h3>User ID: {app.userId}</h3>

<p>Score: {app.matchScore}</p>

<p>{app.matchReason}</p>

</div>

))}

</div>

)

}

export default AdminDashboard