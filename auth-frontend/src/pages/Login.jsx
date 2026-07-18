import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../styles/Auth.css";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
console.log(res.data);
      localStorage.setItem("token", res.data.token);
localStorage.setItem("userEmail",res.data.user.email);
localStorage.setItem("userRole", res.data.user.role);
localStorage.setItem("userName", res.data.user.name);
localStorage.setItem("userPhone", res.data.user.phone);
      toast.success("Login Successful");
      if (res.data.user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/profile");
}
    } catch (error) {
      toast.error(
  error.response?.data?.message || "Login Failed"
);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />

          <div className="password-box">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          <button className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          New user? <Link to="/register">Register Here</Link>
        </p>

        <p>
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;