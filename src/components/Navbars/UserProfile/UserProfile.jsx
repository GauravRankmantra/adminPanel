import { Nav } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/scss/UesrProfile.module.scss";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make the logout API call
      await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={styles.user_menu}>
      <Nav className="p-0 flex-column">
        <Nav.Link href="/profile" className={styles.menu}>
          <i className="fa fa-user"></i>
          <span>My Profile</span>
        </Nav.Link>

        <Nav.Link href="#" className={styles.menu} onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default UserProfile;
