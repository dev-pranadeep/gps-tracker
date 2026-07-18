const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateLocation,
    getAllUsers,
} = require(
  "../controllers/authController"
);

router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);
router.put("/update-location", updateLocation);
router.get("/users", getAllUsers);


router.get("/profile", protect, async (req, res) => {
  res.json({
    message: "Welcome to your profile",
    userId: req.user.id,
  });
});

module.exports = router;