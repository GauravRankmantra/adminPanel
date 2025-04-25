import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/auth",
          {
            withCredentials: true, // Include cookies in the request
          }
        );
        console.log("token check response ", res);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <Loading />;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
