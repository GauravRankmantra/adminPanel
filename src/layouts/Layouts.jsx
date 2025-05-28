import { Link, Outlet } from "react-router-dom";
import { useDashboardDataContext } from "@/context/dashboardDataContext";
import styles from "@/assets/scss/Layouts.module.scss";
import Navbar from "../components/Navbars/Navbar";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import {
  Logo,
  Menu,
  MenuItem,
  Sidebar,
  SidebarBg,
  SidebarToggle,
  SubMenu,
} from "../components/Sidebar/Sidebar";

import { Fragment } from "react";
// Import React Icons
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaMicrophoneAlt,
  FaHome,
  FaGlobe,
  FaEnvelope,
  FaVideo,
  FaList,
  FaDollarSign,
  FaHeadphones,
  FaPlus,
  FaPencilAlt,
  FaFolderOpen,
  FaInfoCircle,
  FaShieldAlt,
  FaScroll,
  FaBars,
} from "react-icons/fa";

const Layouts = () => {
  const {
    isDark,
    sidebarMini,
    setSidebarMini,
    navbarFixed,
    sidebarBgImg,
    sidebarBgColor,
  } = useDashboardDataContext();

  // Define a style object for consistent icon styling
  const iconStyle = {
    marginRight: sidebarMini ? "0px" : "10px", // Adjust margin based on sidebar state
    fontSize: sidebarMini ? "1.4rem" : "1.2rem", // Adjust size based on sidebar state
  };

  return (
    <div className={styles.layout}>
      <ToastContainer />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Sidebar>
        <SidebarBg bgImg={sidebarBgImg} bgColor={sidebarBgColor}>
          <Logo>
            <Link to="/">
              <Fragment>
                <span
                  data-logo="mini-logo"
                  style={{
                    fontSize: sidebarMini ? "20px" : "24px",
                    fontWeight: "bold",
                    color: isDark ? "#ffffff" : "#ffffff",
                  }}
                >
                  Admin
                </span>
              </Fragment>
            </Link>
            <SidebarToggle>
              <button
                type="button"
                onClick={() => setSidebarMini(!sidebarMini)}
              >
                <FaBars />
              </button>
            </SidebarToggle>
          </Logo>
          <Menu>
            <MenuItem routeLink="/dashboard">
              <FaTachometerAlt style={{ ...iconStyle, color: "#FFD700" }} />{" "}
              {/* Gold */}
              <span>Dashboard</span>
            </MenuItem>

            <MenuItem routeLink="/tables">
              <FaUser style={{ ...iconStyle, color: "#4CAF50" }} />{" "}
              {/* Green */}
              <span>Users</span>
            </MenuItem>
            <MenuItem routeLink="/manageSeller">
              <FaUsers style={{ ...iconStyle, color: "#2196F3" }} />{" "}
              {/* Blue */}
              <span>Manage Seller</span>
            </MenuItem>
            <MenuItem routeLink="/forms/all-artist">
              <FaMicrophoneAlt style={{ ...iconStyle, color: "#FF5722" }} />{" "}
              {/* Deep Orange */}
              <span>Artist</span>
            </MenuItem>
            <MenuItem routeLink="/forms/homepage">
              <FaHome style={{ ...iconStyle, color: "#9C27B0" }} />{" "}
              {/* Purple */}
              <span>Home section</span>
            </MenuItem>
            <MenuItem routeLink="/forms/webUpdate">
              <FaGlobe style={{ ...iconStyle, color: "#00BCD4" }} />{" "}
              {/* Cyan */}
              <span>Website Updates</span>
            </MenuItem>
            <MenuItem routeLink="/forms/tickets">
              <FaEnvelope style={{ ...iconStyle, color: "#FFC107" }} />{" "}
              {/* Amber */}
              <span> Messages</span>
            </MenuItem>
            <MenuItem routeLink="/forms/video">
              <FaVideo style={{ ...iconStyle, color: "#FF9800" }} />{" "}
              {/* Orange */}
              <span> Video</span>
            </MenuItem>
            <MenuItem routeLink="/forms/footer">
              <FaList style={{ ...iconStyle, color: "#673AB7" }} />{" "}
              {/* Deep Purple */}
              <span> Footer Management</span>
            </MenuItem>
            <MenuItem routeLink="/forms/sales">
              <FaDollarSign style={{ ...iconStyle, color: "#8BC34A" }} />{" "}
              {/* Light Green */}
              <span> Sales</span>
            </MenuItem>
            <SubMenu
              label="Songs"
              icon={<FaHeadphones style={{ ...iconStyle, color: "#E91E63" }} />}
            >
              {" "}
              {/* Pink */}
              <MenuItem routeLink="/forms/basic-form">
                <FaPlus style={{ ...iconStyle, color: "#9E9E9E" }} />{" "}
                {/* Grey */}
                <span>Add Song</span>
              </MenuItem>
              <MenuItem routeLink="/forms/all-songs">
                <FaPencilAlt style={{ ...iconStyle, color: "#607D8B" }} />{" "}
                {/* Blue Grey */}
                <span>All Songs</span>
              </MenuItem>
              <MenuItem routeLink="/forms/genre">
                <FaPencilAlt style={{ ...iconStyle, color: "#795548" }} />{" "}
                {/* Brown */}
                <span>Genre</span>
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Albums"
              icon={<FaFolderOpen style={{ ...iconStyle, color: "#7B1FA2" }} />}
            >
              {" "}
              {/* Dark Purple */}
              <MenuItem routeLink="/forms/all-album">
                <FaPencilAlt style={{ ...iconStyle, color: "#FBC02D" }} />{" "}
                {/* Yellow Dark */}
                <span>All Albums</span>
              </MenuItem>
              <MenuItem routeLink="/forms/add-album">
                <FaPlus style={{ ...iconStyle, color: "#A1887F" }} />{" "}
                {/* Light Brown */}
                <span>Add Album</span>
              </MenuItem>
            </SubMenu>

            <SubMenu
              label="Add on"
              icon={<FaPlus style={{ ...iconStyle, color: "#536DFE" }} />}
            >
              {" "}
              {/* Indigo */}
              <MenuItem routeLink="/contactInfo">
                <FaInfoCircle style={{ ...iconStyle, color: "#00E5FF" }} />{" "}
                {/* Light Blue Accent */}
                <span>Contact Info</span>
              </MenuItem>
              <MenuItem routeLink="/privacyPolicy">
                <FaShieldAlt style={{ ...iconStyle, color: "#C6FF00" }} />{" "}
                {/* Light Green Accent */}
                <span>Privacy Policy</span>
              </MenuItem>
              <MenuItem routeLink="/terms">
                <FaScroll style={{ ...iconStyle, color: "#FFD54F" }} />{" "}
                {/* Amber Light */}
                <span>Terms And Conditions</span>
              </MenuItem>
            </SubMenu>
          </Menu>
        </SidebarBg>
      </Sidebar>
      <div
        className={styles.content}
        style={{
          width: `${sidebarMini ? "calc(100% - 70px)" : "calc(100% - 280px)"}`,
        }}
      >
        <Navbar />
        <div
          className="p-4"
          style={{
            marginTop: `${navbarFixed ? "80px" : "0"}`,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layouts;