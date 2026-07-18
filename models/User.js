const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
phone:{
  type:String,
  required:true,
  unique:true,
},
location: {
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
},
  password: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
  },

  otpExpire: {
    type: Date,
  },
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model("User", userSchema);