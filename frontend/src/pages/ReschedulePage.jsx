import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ReschedulePage = () => {
  const [searchParams] = useSearchParams();
  const therapistEmail = searchParams.get("therapistEmail");
  const userEmail = searchParams.get("userEmail");
  const navigate = useNavigate();

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/appointments/reschedule/?therapistEmail=${therapistEmail}&userEmail=${userEmail}`, {
        newDate,
        newTime,
      });

      alert("Appointment rescheduled successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment.");
    }
  };

  return (
    <div>
      <h2>Reschedule Appointment</h2>
      <p>Rescheduling appointment for {userEmail}</p>

      <form onSubmit={handleSubmit}>
        <label>
          New Date:
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
        </label>
        <br />
        <label>
          New Time:
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Confirm Reschedule</button>
      </form>
    </div>
  );
};

export default ReschedulePage;
