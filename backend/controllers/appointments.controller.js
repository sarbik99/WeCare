const sendMail = require("../utills/sendMail");

const respondToAppointment = async (req, res) => {
  try {
    const { therapistEmail, userEmail, response } = req.query;

    if (!therapistEmail || !userEmail || !response) {
      return res
        .status(400)
        .json({
          message: "Therapist email, user email, and response are required.",
        });
    }

    let subject, text, html;

    if (response === "accepted") {
      subject = "Your Appointment Request has been Accepted!";
      text = `Your appointment request has been accepted by the therapist. You can proceed as scheduled.`;
      html = `<p>Your appointment request has been <strong>accepted</strong> by the therapist.</p>`;
    } else if (response === "declined") {
      subject = "Your Appointment Request has been Declined";
      text = `Unfortunately, the therapist is unavailable. You may book another appointment.`;
      html = `<p>Unfortunately, the therapist has <strong>declined</strong> your appointment request.</p>`;
    }

    //sending email notification to the user
    const emailResult = await sendMail(userEmail, subject, text, html);

    if (emailResult.success) {
      res
        .status(200)
        .json({ message: `Appointment ${response} successfully!` });
    } else {
      res
        .status(500)
        .json({ message: "Failed to send email", error: emailResult.error });
    }
  } catch (error) {
    console.error("Error responding to appointment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  const { newDate, newTime } = req.body;
  const { therapistEmail, userEmail } = req.query;

  if (!newDate || !newTime) {
    return res
      .status(400)
      .json({ message: "New date and time are required for rescheduling." });
  }
  subject = "Your Appointment has been Rescheduled";
  text = `The therapist has suggested a new appointment time: ${newDate} at ${newTime}.`;
  html = `<p>Your appointment has been requested for <strong>rescheduled</strong> by the therapist.</p>
            <p>New Date: <strong>${newDate}</strong></p>
            <p>New Time: <strong>${newTime}</strong></p>`;

  const emailResult = await sendMail(userEmail, subject, text, html);
  if (emailResult.success) {
    res.status(200).json({ message: `Appointment rescheduled successfully!` });
  } else {
    res
      .status(500)
      .json({ message: "Failed to send email", error: emailResult.error });
  }
};

module.exports = { respondToAppointment , rescheduleAppointment};
