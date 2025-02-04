const express = require("express")
const router = express.Router();
const { therapist_signup, therapist_signin , checkTherapistAuth , searchTherapists , therapistBooking } = require('../controllers/therapist.controller');

// Therapist routes
router.post('/signup', therapist_signup);
router.post('/signin',therapist_signin);

// Auto sign-in route (checks refresh token and returns a new access token)
router.get("/auto-signin", checkTherapistAuth, (req, res) => {
    res.status(200).json({
        message: "Auto sign-in successful",
        therapist: req.therapist,
        accessToken: req.accessToken,
    });
});

// Protected route for therapist dashboard (only accessible if authenticated)
router.get("/dashboard", checkTherapistAuth, (req, res) => {
    res.status(200).json({
        message: "Welcome to the therapist dashboard!",
        therapist: req.therapist,
    });
});

//booking therapists
router.post("/book-appointment", therapistBooking);

//searching for therapists
router.get("/search", searchTherapists);

module.exports = router;