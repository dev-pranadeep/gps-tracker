const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const crypto= require("crypto");
const nodemailer= require("nodemailer");

// REGISTER
const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or Phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    const { password: pwd, ...userData } =
      user._doc;

    res.status(201).json({
      message: "User Registered Successfully",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const { password: pwd, ...userData } = user._doc;

res.status(200).json({
  message: "Login Successful",
  token,
  user: userData,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("EMAIL:", email);

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `,
    });

    res.json({
      message:
        "OTP sent successfully",
    });
  } catch (error) {
    console.log(
      "FORGOT PASSWORD ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
//reset password
const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or Expired OTP",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpire = undefined;

  await user.save();

  res.json({
    message: "Password Reset Successful",
  });
};
const changePassword =
  async (req, res) => {
    try {
      const {
        phone,
        password,
      } = req.body;

      const user =
        await User.findOne({
          phone,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.json({
        message:
          "Password Changed Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  const updateLocation = async (req, res) => {
  try {
    const { email, latitude, longitude } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.location = {
      latitude,
      longitude,
      updatedAt: new Date(),
    };

    await user.save();

    res.json({
      message: "Location updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "-password -otp -otpExpire -resetPasswordToken -resetPasswordExpire"
    );
    users.forEach((user) => {
});
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateLocation,
  getAllUsers,
};