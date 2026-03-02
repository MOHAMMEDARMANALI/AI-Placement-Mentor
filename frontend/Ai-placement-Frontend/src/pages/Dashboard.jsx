import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage("Access denied");
        } else {
          setMessage(data.message);
        }
      });

  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
      <button onClick={() => navigate("/profile")}>
        Go to Profile
       </button>

      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;