import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
function Register() {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [passwordChecks, setPasswordChecks] = useState({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false,
});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone:"",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const checkPasswordStrength = (password) => {
  setPasswordChecks({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
if (
  !passwordChecks.length ||
  !passwordChecks.uppercase ||
  !passwordChecks.lowercase ||
  !passwordChecks.number ||
  !passwordChecks.special
) {
  toast.error("Password does not meet all requirements");
  return;
}
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      toast.success("Registration Successful");
     setTimeout(() => {
  navigate("/");
}, 1500);
    } catch (error) {
     toast.error(
  error.response?.data?.message ||
  "Registration Failed"
);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={(e) => {
  handleChange(e);
  checkPasswordStrength(e.target.value);
}}
          />

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
<input
            className="auth-input"
            type="tel"
            name="phone"
            placeholder="Enter Phone Number"
            onChange={handleChange}
          />
          <div className="password-box">
                      <input
  className="auth-input"
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Enter Password"
  onChange={(e) => {
    handleChange(e);
    checkPasswordStrength(e.target.value);
  }}
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
<div
  style={{
    marginTop: "10px",
    textAlign: "left",
    fontSize: "14px",
  }}
>
  <p>{passwordChecks.length ? "✅" : "❌"} At least 8 characters</p>

  <p>{passwordChecks.uppercase ? "✅" : "❌"} One uppercase letter (A-Z)</p>

  <p>{passwordChecks.lowercase ? "✅" : "❌"} One lowercase letter (a-z)</p>

  <p>{passwordChecks.number ? "✅" : "❌"} One number (0-9)</p>

  <p>{passwordChecks.special ? "✅" : "❌"} One special character (@#$%)</p>
</div>

          <button className="auth-btn">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;