import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/RegisterTherapist.module.css";

const RegisterTherapist = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    degree: "",
    license_no: "",
    location: { state: "", district: "", pin: "" },
  });

  const navigate = useNavigate();

  // Handles input for all fields except `location`
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  Handles input for `location` fields
  const handleLocationChange = (e) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [e.target.name]: e.target.value,
      },
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    try {
      const res = await axios.post(
        "http://localhost:8080/api/therapists/signup", 
        formData
      );
      alert("Signup successful!");
      navigate("/therapists/signin");
    } catch (error) {
      alert(error.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register as a Therapist</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="degree" placeholder="Degree" onChange={handleChange} required />
        <input name="license_no" placeholder="License No" onChange={handleChange} required />
        <input name="state" placeholder="State" onChange={handleLocationChange} required />
        <input name="district" placeholder="District" onChange={handleLocationChange} required />
        <input name="pin" placeholder="Pin Code" onChange={handleLocationChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default RegisterTherapist;
