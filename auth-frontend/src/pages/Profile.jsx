import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const phone = localStorage.getItem("userPhone");

  const logout = () => {
    localStorage.clear();

    toast.success("Logged Out Successfully");

    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>👋 Welcome, {name}</h1>

        <p><b>Email:</b> {email}</p>

        <p><b>Phone:</b> {phone}</p>

        <button
          className="auth-btn"
          onClick={() => navigate("/map")}
          style={{ marginTop: "20px" }}
        >
          📍 Open Live Map
        </button>

        <button
          className="auth-btn"
          onClick={logout}
          style={{
            marginTop: "10px",
            background: "red",
          }}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;