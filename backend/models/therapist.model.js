//imports
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config()

const therapist_schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password: {
        type: String ,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+@.+\..+/,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    gender: {
        type: String,
        required: true
    },
    degree:{
        type: String,
        required: true
    },
    license_no:{
        type: String,
        required: true
    },
    location:{
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        pin: {
            type: String,
            required: true,
            match: [/^\d{6}$/, "Please enter a valid 6-digit pin code"]
        }
    },
    refreshToken: {
        type: String,
    },
},{
    timestamps: true
});
//therapist_schema pre middlewares
therapist_schema.pre("save",async function(next){
    // checks if the password field is modified before saving
  // if not -> ignores
  // else -> encrypts the password before saving
  const saltRounds = parseInt(process.env.ENCRYPTION_SALT_ROUNDS) || 10
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      saltRounds
    );
  }
  if (this.isModified('location.state')) {
    this.location.state = this.location.state.toLowerCase();
  }
  if (this.isModified('location.district')) {
    this.location.district = this.location.district.toLowerCase();
  }
  next();
})
// user schema methods
therapist_schema.methods.generateAccessToken = function () {
    // generates access token for user
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || "10d";
    console.log("ExpiresIn Value:", expiresIn);
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: String(expiresIn)
      }
    );
  };
  
  therapist_schema.methods.generateRefreshToken = function () {
    // generates refresh token for user
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || "10d";
    console.log("ExpiresIn Value:", expiresIn);
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: String(expiresIn),
      }
    );
  };
  
  therapist_schema.methods.isPasswordCorrect = async function (password) {
    // checks if the password is correct for given user or not
    return await bcrypt.compare(password, this.password);
  };

const Therapist = mongoose.model("Therapist", therapist_schema);
module.exports = Therapist