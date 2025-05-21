import { useEffect, useRef, useState } from "react";
import NavBarBgWrapper from "@/components/Navbars/NavBarBgWrapper";
import DropdownMenu from "@/components/DropdownMenu/DropdownMenu";
import Notification from "@/components/Navbars/Notification/Notification";
import { TbMusicPlus } from "react-icons/tb";

import Message from "@/components/Navbars/Message/Message";
import UserProfile from "@/components/Navbars/UserProfile/UserProfile";
import SearchBar from "@/components/SearchBar/SearchBar";
import profile from "@/assets/image/admin.jpeg";
import { useDashboardDataContext } from "@/context/dashboardDataContext";
import styles from "@/assets/scss/Navbar.module.scss";
import DarkModeSwitch from "@/components/DarkModeSwitch/DarkModeSwitch";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [openNotification, setOpenNotification] = useState(true);
  const [openMessage, setOpenMessage] = useState(true);
  const [openUser, setOpenUser] = useState(true);
  const [isOpenSearch, setIsOpenSearch] = useState(true);
  const { topNavbarBgColor, setSidebarMini, sidebarMini, isThemeDirection } =
    useDashboardDataContext();

  const navigate = useNavigate();
  const handleMessageClick = () => {
    navigate("/forms/tickets");
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/ticket?status=Pending"
        );
        setMessages(res.data || []);
        console.log("Fetched messages:", res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, []);
  let dropRef = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpenNotification(true);
        setOpenMessage(true);
        setOpenUser(true);
      }
    });
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <NavBarBgWrapper>
      <div data-color={topNavbarBgColor} className={`${styles.navbar_wrapper}`}>
        <div className="d-flex align-items-center justify-content-between">
          <div className={styles.navbar_nav}>
            <ul
              className={styles.header_left}
              ref={dropRef}
              style={{
                paddingLeft: `${!sidebarMini ? "5px" : ""}`,
              }}
            >
              <li
                className={`${styles.sidebar_mini} ${
                  sidebarMini ? styles.active_sidebar_mini : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSidebarMini(!sidebarMini)}
                >
                  <span className={styles.sidebar_menu_icon}></span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/forms/basic-form")}
                >
                  <TbMusicPlus />
                </button>
              </li>
              {/* <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenNotification(!openNotification);
                                        setOpenMessage(true);
                                    }}
                                    className={styles.for_notification}
                                >
                                    <i className="fa fa-bell"></i>
                                    <span
                                        className={`${styles.count} ${
                                            topNavbarBgColor === "red"
                                                ? "bg-info"
                                                : "bg-danger"
                                        }`}
                                    >
                                        5
                                    </span>
                                </button>
                                {!openNotification ? (
                                    <DropdownMenu
                                        top="66px"
                                        right="auto"
                                        left="auto"
                                    >
                                        <Notification />
                                    </DropdownMenu>
                                ) : null}
                            </li> */}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    // setOpenMessage(!openMessage);
                    // setOpenNotification(true);
                    navigate("/forms/tickets");
                  }}
                  className={styles.for_message}
                >
                  <i className="fa-solid fa-envelope"></i>
                  <span className={`${styles.count} bg-primary`}>
                    {messages.length}
                  </span>
                </button>
                {!openMessage ? (
                  <DropdownMenu top="66px" right="auto" left="auto">
                    <Message />
                  </DropdownMenu>
                ) : null}
              </li>
            </ul>
          </div>
          <div
            className={`${styles.navbar_nav} ${styles.navbar_nav_right}`}
            ref={dropRef}
          >
            <DarkModeSwitch />
            <div className={styles.user_area}>
              <a
                href="#"
                onClick={() => {
                  setOpenUser(!openUser);
                  setOpenMessage(true);
                  setOpenNotification(true);
                }}
                className={styles.user_dropdown}
              >
                <img src={user?.coverImage} alt="uesr" />
              </a>
            </div>
            {!openUser ? (
              <DropdownMenu
                top="50px"
                right={isThemeDirection ? "auto" : "24px"}
                left={isThemeDirection ? "24px" : "auto"}
              >
                <UserProfile />
              </DropdownMenu>
            ) : null}
          </div>
        </div>
        {!isOpenSearch ? (
          <SearchBar
            isOpenSearch={isOpenSearch}
            setIsOpenSearch={setIsOpenSearch}
          />
        ) : null}
      </div>
    </NavBarBgWrapper>
  );
};

export default Navbar;
