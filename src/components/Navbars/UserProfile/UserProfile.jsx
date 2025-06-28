import { Nav, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/scss/UesrProfile.module.scss";
import { useState } from "react";

const UserProfile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Make the logout API call
      // await axios.post(
      //   "${apiUrl}/auth/logout",
      //   {},
      //   {
      //     withCredentials: true, // Ensure cookies are sent
      //   }
      // );
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally, set loggingOut back to false to allow retry
      setLoggingOut(false);
    }
  };

  return (
    <div className={styles.user_menu}>
      <Nav className="p-0 flex-column">
        <Nav.Link href="/Profile" className={styles.menu}>
          <i className="fa fa-user"></i>
          <span>My Profile</span>
        </Nav.Link>

        <Nav.Link
          href="#"
          className={styles.menu}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mr-2"
              />
              <span>Logging Out...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </>
          )}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default UserProfile;
