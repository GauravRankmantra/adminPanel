import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

  if (isAuthenticated === null)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f4f8", // Light background
          animation: "fadeIn 1s ease-in-out", // Fade-in animation
        }}
      >
        <div
          style={{
            border: "8px solid #e0e0e0", // Light grey border
            borderTop: "8px solid #3498db", // Blue top border
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            animation: "spin 1.5s linear infinite", // Spinning animation
          }}
        ></div>
        <style>
          {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
       @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `}
        </style>
      </div>
    );

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
