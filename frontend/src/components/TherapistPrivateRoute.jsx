import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const TherapistPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/therapists/auto-signin", {
          withCredentials: true,
        });

        console.log("Auto-signin response:", res.data); // ✅ Debugging

        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log("Auto-signin error:", err.response?.data); // ✅ Debugging
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/therapists/signin" />;
};

export default TherapistPrivateRoute;
