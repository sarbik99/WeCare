import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SigninTherapist.module.css"
const SignInTherapist = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/therapists/signin",
        formData,
        { withCredentials: true }
      );
      console.log("Sign-in response:", res.data);
      
      alert("Login successful!");
      navigate("/therapists/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error signing in");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Therapist Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInTherapist;
