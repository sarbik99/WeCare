import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/TherapistSearch.module.css";
import { useNavigate } from "react-router-dom";
const TherapistSearch = () => {
  const [searchParams, setSearchParams] = useState({
    state: "",
    district: "",
    pin: "",
  });
  const [therapists, setTherapists] = useState([]);
  const [loading , setLoading] = useState(false); 
  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };
  const handleSearch = async () => {
    try {
      setLoading(true); // Start loading

      const queryParams = new URLSearchParams(searchParams).toString();
      const res = await axios.get(`http://localhost:8080/api/therapists/search?${queryParams}`);
      
      setTherapists(res.data); // Set fetched therapists data
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error searching therapists:", error);
      alert("Failed to fetch therapists.");
      setLoading(false); // Stop loading
    }
  };
  const navigate = useNavigate();
  const handleProfileClick = (therapist) => {
    // Navigate to the booking page with therapist's id
    navigate(`/therapists/book-appointment/${therapist._id}`, { state: { therapist } });
  };


  return (
    <div className={styles.container}>
      <h2>Find & Book a Therapist</h2>

      {/* Search Inputs */}
      <div className={styles.searchBox}>
        
        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleChange}
        />
        <input
          type="text"
          name="district"
          placeholder="District"
          onChange={handleChange}
        />
        <input
          type="text"
          name="pin"
          placeholder="Pin Code"
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      <div className={styles.resultBox}>
        {!loading ? <div>
          {therapists.length > 0 ? (
          therapists.map((therapist) => (
            <div
              key={therapist._id}
              className={styles.therapistCard} // Redirect to booking page
            >
              <h3>{therapist.name}</h3>
              <p>{therapist.degree}</p>
              <p>Location: {therapist.location.state}, {therapist.location.district},
                {therapist.location.pin}
              </p>
              <button onClick={() => handleProfileClick(therapist)}>visit</button>
            </div>
          ))
        ) : (
          <p>No therapists found.</p>
        )} </div> : <p>
          Loading....
        </p> }
      </div>
    </div>
  );
};

export default TherapistSearch;