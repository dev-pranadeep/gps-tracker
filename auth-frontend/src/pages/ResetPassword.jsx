import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate(); 
  const email = localStorage.getItem("resetEmail");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

const [passwordChecks, setPasswordChecks] = useState({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false,
});
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(600); //10 minutes
  const [resendTimer, setResendTimer] = useState(60); //60 seconds

  // OTP Expiry Timer
  useEffect(() => {
    if (otpTimer <= 0) return;

    const timer = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpTimer]);

  // Resend Timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

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

if (password !== confirmPassword) {
  toast.error("Passwords do not match");
  return;
}
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          otp,
          password,
        }
      );

      toast.success(res.data.message);

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
  navigate("/");
}, 1500);
    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Password Reset Failed"
);
    }

    setLoading(false);
  };

  const resendOTP = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      toast.success("New OTP Sent");

      setResendTimer(60);
      setOtpTimer(600);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Reset Password</h1>

        <p
          style={{
            color: otpTimer > 60 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          OTP Expires In :
          {" "}
          {Math.floor(otpTimer / 60)}:
          {(otpTimer % 60)
            .toString()
            .padStart(2, "0")}
        </p>

        <form onSubmit={handleSubmit}>

          <input
            className="auth-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            required
          />

          <div className="password-box">

            <input
              className="auth-input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              value={password}
              onChange={(e) => {
  setPassword(e.target.value);
  checkPasswordStrength(e.target.value);
}}
              required
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
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
<div
  className="password-box"
  style={{ marginTop: "15px" }}
>
  <input
    className="auth-input"
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(e.target.value)
    }
    required
  />

  <span
    className="eye-icon"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
  >
    {showConfirmPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </span>
</div>
          <button
            className="auth-btn"
            disabled={loading || otpTimer <= 0}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

        <button
          className="auth-btn"
          style={{ marginTop: "15px" }}
          onClick={resendOTP}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : "Resend OTP"}
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;