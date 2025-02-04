import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios to send data to the backend

const TherapistBookingPage = () => {
  const location = useLocation();
  const therapist = location.state?.therapist;

  if (!therapist) {
    return <p>No therapist data found. Please go back and select a therapist.</p>;
  }

  // Handle the form state for booking appointment
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    userEmail: "",
    phoneNo: "",
    date: "",
    time: "",
    preferredMode: "",
  });

  const handleInputChange = (e) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!therapist) {
      alert("No therapist data found.");
      return;
    }
    // Prepare data for backend
    const bookingData = {
      therapistEmail: therapist.email,
      userEmail: appointmentDetails.userEmail,
      name: appointmentDetails.name,
      phoneNo: appointmentDetails.phoneNo,
      date: appointmentDetails.date,
      time: appointmentDetails.time,
      preferredMode: appointmentDetails.preferredMode,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/therapists/book-appointment", bookingData);
      alert("Appointment request sent successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  return (
    <div>
      <h2>Book an Appointment with {therapist.name}</h2>
      <p>Degree: {therapist.degree}</p>
      <p>
        Location: {therapist.location?.state}, {therapist.location?.district}
      </p>
      <p>Gender: {therapist.gender}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Your Name:
          <input type="text" name="name" value={appointmentDetails.name} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Your Email:
          <input type="email" name="userEmail" value={appointmentDetails.userEmail} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Your Phone No:
          <input type="text" name="phoneNo" value={appointmentDetails.phoneNo} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Select Date:
          <input type="date" name="date" value={appointmentDetails.date} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Select Time:
          <input type="time" name="time" value={appointmentDetails.time} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Preferred Mode:
          <select name="preferredMode" value={appointmentDetails.preferredMode} onChange={handleInputChange} required>
            <option value="">Select Mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </label>
        <br />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default TherapistBookingPage;
