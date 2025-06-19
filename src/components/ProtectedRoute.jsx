import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role === "admin") {
            console.log(user.role === "admin");
            setIsAuthenticated(true);
            return;
          }
        }
        setIsAuthenticated(false); // Moved this outside so it's not skipped
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ Correct loading state
  if (isAuthenticated === null) return <Loading />;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
