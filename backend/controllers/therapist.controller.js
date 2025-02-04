const Therapist = require("../models/therapist.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const ms = require("ms"); // For converting string time values (e.g., "10d") into milliseconds
const sendMail = require("../utills/sendMail");

const therapistBooking = async (req, res) => {
  try {
    const {
      therapistEmail,
      userEmail,
      name,
      phoneNo,
      date,
      time,
      preferredMode,
    } = req.body;

    if (
      !therapistEmail ||
      !userEmail ||
      !date ||
      !time ||
      !name ||
      !phoneNo ||
      !preferredMode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subject = "New Appointment Request";

    // Generate URLs for Accept & Decline
    const acceptUrl = `http://localhost:8080/api/appointments/respond?therapistEmail=${therapistEmail}&userEmail=${userEmail}&response=accepted`;
    const declineUrl = `http://localhost:8080/api/appointments/respond?therapistEmail=${therapistEmail}&userEmail=${userEmail}&response=declined`;

    // Reschedule form link
    const rescheduleFormUrl = `http://localhost:5173/therapists/reschedule?therapistEmail=${therapistEmail}&userEmail=${userEmail}`;

    const html = `
      <p>You have received a new appointment request from <strong>${name}</strong>.</p>
      <p><strong>Contact Details:</strong></p>
      <p>Email: ${userEmail}</p>
      <p>Phone: ${phoneNo}</p>
      <p><strong>Requested Date:</strong> ${date}</p>
      <p><strong>Requested Time:</strong> ${time}</p>
      <p><strong>Preferred Mode:</strong> ${preferredMode}</p>

      <p><strong>Respond to the request:</strong></p>
      <a href="${acceptUrl}" style="background-color: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Accept</a>
      <a href="${declineUrl}" style="background-color: red; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-left:10px;">Decline</a>
      <a href="${rescheduleFormUrl}" style="background-color: blue; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-left:10px;">Reschedule</a>
    `;

    const text = `Appointment request from ${name}.\n
                  Email: ${userEmail}, Phone: ${phoneNo}\n
                  Requested Date: ${date}, Time: ${time}, Mode: ${preferredMode}\n
                  Accept: ${acceptUrl}\n
                  Decline: ${declineUrl}\n
                  Reschedule: ${rescheduleFormUrl}`;

    const emailResult = await sendMail(therapistEmail, subject, text, html);

    if (emailResult.success) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to send email", error: emailResult.error });
    }

    res
      .status(200)
      .json({ message: "Appointment request email sent successfully" });
  } catch (error) {
    console.error("Error sending appointment email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

const searchTherapists = async (req, res) => {
  try {
    const { state, district, pin } = req.query;

    const stateLower = state ? state.toLowerCase() : null;
    const districtLower = district ? district.toLowerCase() : null;
    const pinLower = pin ? pin.toString() : null; // Ensure pin is a string

    if (!stateLower || !districtLower) {
      return res
        .status(400)
        .json({ message: "State and District are required!" });
    }

    //case insensetive query
    let query = {
      "location.state": { $regex: new RegExp(`^${stateLower}$`, "i") }, // Case-insensitive match
      "location.district": { $regex: new RegExp(`^${districtLower}$`, "i") }, // Case-insensitive match
    };

    console.log("Executing Query:", JSON.stringify(query, null, 2)); // Debugging log

    let therapists = await Therapist.find(query)
      .select("name location gender email degree")
      .lean();

    if (therapists.length === 0) {
      return res
        .status(404)
        .json({ message: "No therapists found matching your criteria." });
    }

    // Pin-matching therapists should come first
    therapists.sort((a, b) => {
      if (pinLower) {
        const aPinMatches = a.location.pin === pinLower;
        const bPinMatches = b.location.pin === pinLower;

        if (aPinMatches && !bPinMatches) return -1; // move pin-matching therapists up
        if (!aPinMatches && bPinMatches) return 1; // move non-matching ones down
      }
      return 0;
    });

    res.status(200).json(therapists);
  } catch (error) {
    console.error("Error fetching therapists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkTherapistAuth = async (req, res, next) => {
  try {
    //Get the refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token found. Please sign in." });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    console.log("Decoded Token:", decoded); // Log decoded token to ensure it's being decoded correctly

    if (!decoded) {
      return res.status(403).json({ message: "Invalid token." });
    }

    //Find the therapist by ID
    const therapist = await Therapist.findById(decoded._id);

    if (!therapist || therapist.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: "Invalid refresh token. Please sign in again." });
    }

    // Generate new access token and attach to request object
    const newAccessToken = therapist.generateAccessToken();
    req.therapist = therapist;
    req.accessToken = newAccessToken;

    next(); // Move to the next route handler
  } catch (error) {
    console.error("Therapist authentication error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const therapist_signup = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const {
      name,
      password,
      email,
      phone,
      gender,
      degree,
      license_no,
      location,
    } = req.body;

    // Validating request body
    if (
      !name ||
      !password ||
      !email ||
      !phone ||
      !gender ||
      !degree ||
      !license_no ||
      !location ||
      !location.state ||
      !location.district ||
      !location.pin
    ) {
      return res.status(400).json({
        message: "All required fields must be provided!",
      });
    }

    // Checking for an existing therapist by email
    const existingTherapist = await Therapist.findOne({ email });
    if (existingTherapist) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Creating a new therapist object (password will be hashed automatically by pre-save middleware)
    const newTherapist = new Therapist({
      name,
      password, // plain password, middleware will hash it
      email,
      phone,
      gender,
      degree,
      license_no,
      location,
    });

    // Saving new therapist
    await newTherapist.save();

    // Generate access and refresh tokens
    const accessToken = await newTherapist.generateAccessToken();
    const refreshToken = await newTherapist.generateRefreshToken();
    console.log("Generated Refresh Token:", refreshToken);

    // Saving refresh token in the therapist document
    newTherapist.refreshToken = refreshToken;
    await newTherapist.save();

    // Set the Refresh Token in a secure, HTTP-only cookie
    const refreshTokenExpiry = ms(process.env.REFRESH_TOKEN_EXPIRY); // Converts "10d" to milliseconds
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      sameSite: "Strict", // Prevent CSRF by restricting cookie to same-site requests
      maxAge: refreshTokenExpiry, // 10d expiry from .env
    });

    // Responding with success message and tokens
    res.status(201).json({
      message: "Therapist created successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error signing up therapist! \n", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const therapist_signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const therapist = await Therapist.findOne({ email: email });
    if (!therapist) {
      res.status(400).json({ message: "Therapist not registered!" });
    }
    const isMatch = await bcrypt.compare(password, therapist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }
    const accessToken = therapist.generateAccessToken();
    const refreshToken = therapist.generateRefreshToken();
    therapist.refreshToken = refreshToken;
    await therapist.save();
    const refreshTokenExpiry = ms(process.env.REFRESH_TOKEN_EXPIRY || "10d");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (secure)
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: refreshTokenExpiry, // Sets expiration
    });
    return res.status(200).json({
      message: "Login successful!",
      accessToken,
    });
  } catch (error) {
    console.error("Enter signing in the therapist: ", error);
    res.status(500).json({ message: "Error signing in", error });
  }
};

module.exports = {
  therapist_signup,
  therapist_signin,
  checkTherapistAuth,
  searchTherapists,
  therapistBooking,
};
