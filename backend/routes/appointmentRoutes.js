const express = require("express")
const router = express.Router();
const { respondToAppointment , rescheduleAppointment} = require("../controllers/appointments.controller");

router.get("/respond", respondToAppointment);
router.post("/reschedule" , rescheduleAppointment)

module.exports = router;
