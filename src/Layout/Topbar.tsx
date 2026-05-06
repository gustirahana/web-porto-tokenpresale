import { THEME_MODE } from "../Common/layoutConfig";
import { Link } from "react-router-dom";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import SimpleBar from "simplebar-react";

//import images
import avatar1 from "../assets/images/user/avatar-1.jpg";
import avatar2 from "../assets/images/user/avatar-2.jpg";
import avatar3 from "../assets/images/user/avatar-3.jpg";
import { chanageLanguage } from "../toolkit/themeLayouts/thunk";
import i18n from "../utils/i18n";

interface HeaderProps {
    themeMode?: string; // Define the type for themeMode
    changeThemeMode?: any; // Define the type for changeThemeMode function
    toogleSidebarHide?: () => void;
    toogleMobileSidebarHide?: () => void;
    handleOffcanvasToggle?: () => void;
}

const TopBar = ({ handleOffcanvasToggle, changeThemeMode, toogleSidebarHide, toogleMobileSidebarHide }: HeaderProps) => {

    const dispatch = useDispatch<any>();

    const handleLanguageChange = (language: string) => {
        dispatch(chanageLanguage(language));
        i18n.changeLanguage(language);
    };

    // Function to handle theme mode change
    const handleThemeChange = (value: any) => {
        dispatch(changeThemeMode(value));
    };

    return (
        <React.Fragment>
            <header className="pc-header">
                <div className="header-wrapper">
                    <div className="me-auto pc-mob-drp">
                        <ul className="list-unstyled">
                            <li className="pc-h-item pc-sidebar-collapse">
                                <Link to="#" className="pc-head-link ms-0" id="sidebar-hide" onClick={toogleSidebarHide}>
                                    <i className="ti ti-menu-2"></i>
                                </Link>
                            </li>
                            <li className="pc-h-item pc-sidebar-popup">
                                <Link to="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={toogleMobileSidebarHide}>
                                    <i className="ti ti-menu-2"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default TopBar;