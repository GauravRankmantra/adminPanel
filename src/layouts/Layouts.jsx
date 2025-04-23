import { Link, Outlet } from "react-router-dom";
import { useDashboardDataContext } from "@/context/dashboardDataContext";
import styles from "@/assets/scss/Layouts.module.scss";
import Navbar from "../components/Navbars/Navbar";
import { ToastContainer } from "react-toastify";
import {
    Logo,
    Menu,
    MenuItem,
    NavTitle,
    Sidebar,
    SidebarBg,
    SidebarToggle,
    SubMenu,
} from "../components/Sidebar/Sidebar";

import { Fragment } from "react";

const Layouts = () => {
    const {
        isDark,
        sidebarMini,
        setSidebarMini,
        navbarFixed,
        sidebarBgImg,
        sidebarBgColor,
    } = useDashboardDataContext();

    return (
        <div className={styles.layout}>
                <ToastContainer />
            <Sidebar>
                <SidebarBg bgImg={sidebarBgImg} bgColor={sidebarBgColor}>
                    <Logo>
                        <Link to="/">
                            <Fragment>
                                {/* Replacing the logo images with the text "Admin" */}
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
                                <i className="fa-solid fa-bars-progress" />
                            </button>
                        </SidebarToggle>
                    </Logo>
                    <Menu>
                        <MenuItem routeLink="/dashboard">
                            <i className="fa fa-dashboard" />
                            <span>Dashboard</span>
                        </MenuItem>
                       

                        <MenuItem routeLink="/tables">
                            <i className="fa fa-table" />
                            <span>Users</span>
                        </MenuItem>
                        <SubMenu
                            label="Songs"
                            icon={<i className="fa fa-headphones" />}
                        >
                            <MenuItem routeLink="/forms/basic-form">
                                <i className="fa fa-pencil-square" />
                                <span>Add Song</span>
                            </MenuItem>

                            <MenuItem routeLink="/forms/all-songs">
                                <i className="fa fa-pencil-square" />
                                <span>All Songs</span>
                            </MenuItem>
                        </SubMenu>
                        <SubMenu
                            label="Albums"
                            icon={<i className="fa fa-folder-open" />}
                        >
                            <MenuItem routeLink="/forms/all-album">
                                <i className="fa fa-pencil-square" />
                                <span>All Albums</span>
                            </MenuItem>
                            
                            <MenuItem routeLink="/forms/add-album">
                                <i className="fa fa-pencil-square" />
                                <span>Add Album</span>
                            </MenuItem>
                           
                        </SubMenu>
                        <SubMenu
                            label="Add on"
                            icon={<i className="fa fa-folder-open" />}
                        >
                            <MenuItem routeLink="/contactInfo">
                                <i className="fa fa-pencil-square" />
                                <span>Contact Info</span>
                            </MenuItem>
                            <MenuItem routeLink="/privacyPolicy">
                                <i className="fa fa-pencil-square" />
                                <span>Privacy Policy</span>
                            </MenuItem>
                            
                            <MenuItem routeLink="/terms">
                                <i className="fa fa-pencil-square" />
                                <span>Terms And Conditions</span>
                            </MenuItem>
                           
                        </SubMenu>
                        
                        
                        {/* <NavTitle>
                            <span>Extras</span>
                        </NavTitle> */}
                        {/* <SubMenu
                            label="Pages"
                            icon={<i className="fa fa-paperclip" />}
                        >
                            <MenuItem routeLink="/login">
                                <i className="fa fa-sign-in" />
                                <span>Login</span>
                            </MenuItem>
                            <MenuItem routeLink="/register">
                                <i className="fa fa-sign-in" />
                                <span>Register</span>
                            </MenuItem>
                            <MenuItem routeLink="/page404">
                                <i className="fa fa-paper-plane" />
                                <span>Page 404</span>
                            </MenuItem>
                            <MenuItem routeLink="/page500">
                                <i className="fa fa-paper-plane" />
                                <span>Page 500</span>
                            </MenuItem>
                        </SubMenu> */}
                    </Menu>
                </SidebarBg>
            </Sidebar>
            <div
                className={styles.content}
                style={{
                    width: `${
                        sidebarMini ? "calc(100% - 70px)" : "calc(100% - 280px)"
                    }`,
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
