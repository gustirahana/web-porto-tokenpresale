import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { menuItems } from "../MenuData";

const Sidebar = () => {
    const router = useLocation();
    const [username, setUsername] = useState<string | null>(null);
    const isAccounting = (username || '').trim().toLowerCase() === 'accounting';
    useEffect(() => {
        try {
            setUsername(localStorage.getItem('username'));
        } catch {}
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'username') {
                setUsername(e.newValue);
            }
        };
        const handleUsernameCustom = (e: Event) => {
            const detail = (e as CustomEvent).detail ?? localStorage.getItem('username');
            setUsername(detail);
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('username-changed', handleUsernameCustom as EventListener);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('username-changed', handleUsernameCustom as EventListener);
        }
    }, []);

    const [openMenu, setOpenMenu] = useState<any>({});

    const handleMenuClick = (id: any) => {
        setOpenMenu((prevOpenMenu: any) => ({
            ...prevOpenMenu,
            [id]: !prevOpenMenu[id]
        }));
    };

    const computedMenuItems = useMemo(() => {
        // Use menuItems as the source of truth; only hide Input Expenses for non-Accounting users
        return (menuItems || []).filter((item: any) => {
            if ((item?.id === 'expensesInput' || item?.link === '/expenses') && username !== 'Accounting') return false;
            return true;
        });
    }, [username]);

    useEffect(() => {
        // Initialize openMenu state based on local storage or current location
        const initialOpenMenu: any = {};

        const checkSubmenu = (submenu: any) => {
            if (!submenu) return false;
            return submenu.some((subItem: any) => router.pathname.startsWith(subItem.link));
        };

        computedMenuItems.forEach((menuItem: any) => {
            if (menuItem.submenu) {
                initialOpenMenu[menuItem.id] = checkSubmenu(menuItem.submenu);
                menuItem.submenu.forEach((subItem: any) => {
                    if (subItem.submenu) {
                        initialOpenMenu[subItem.id] = checkSubmenu(subItem.submenu);
                    }
                });
            } else {
                initialOpenMenu[menuItem.id] = router.pathname === menuItem.link;
            }
        });

        setOpenMenu(initialOpenMenu);
    }, [router.pathname, computedMenuItems]);

    useEffect(() => {
        // Save openMenu state to local storage
        localStorage.setItem("openMenu", JSON.stringify(openMenu));
    }, [openMenu]);

    const isMenuActive = (menuItem: any) => {
        return router.pathname === menuItem.link;
    };

    return (
        <React.Fragment>
            {(computedMenuItems || []).filter((item: any) => {
                if ((item?.id === 'expensesInput' || item?.link === '/expenses') && username !== 'Accounting') return false;
                return true;
            }).map((item: any, key: any) => (
                <React.Fragment key={key}>
                    {/* {!item['isHeader'] ? */}
                    {!item["isHeader"] ? (
                        <>
                            {!item.submenu ? (
                                <>
                                    <li
                                        className={`pc-item ${isMenuActive(item) ? "active" : ""}`}
                                    >
                                        <Link
                                            to={item.link && item.link}
                                            data-page="index"
                                            className="pc-link"
                                        >
                                            <span className="pc-micon">
                                                <i className={`${item.icon}`}></i>
                                            </span>
                                            <span className="pc-mtext">{item.label}</span>
                                            {item.badge ? (
                                                <span className="pc-badge">{item.badge}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <React.Fragment>
                                    <li
                                        className={`pc-item pc-hasmenu ${openMenu[item.id] ||
                                            item.submenu?.some((subItem: any) =>
                                                isMenuActive(subItem)
                                            )
                                            ? "pc-trigger active 1111"
                                            : ""
                                            }`}
                                    >
                                        <span
                                            className="pc-link"
                                            onClick={() => {
                                                handleMenuClick(item.id);
                                            }}
                                        >
                                            <span className="pc-micon">
                                                <i className={`${item.icon}`}></i>
                                            </span>
                                            <span className="pc-mtext">{item.label}</span>
                                            <span className="pc-arrow">
                                                <FeatherIcon icon="chevron-right" />
                                            </span>
                                        </span>
                                        <ul
                                            // className="pc-submenu"
                                            className={`pc-submenu ${openMenu[item.id] ? "open" : ""}`}
                                            style={{
                                                display: openMenu[item.id] ? "block" : "none"
                                            }}
                                        >
                                            {(item.submenu || []).map((subItem: any, key: any) => (
                                                !subItem.submenu ? (
                                                    <li
                                                        className={`pc-item ${isMenuActive(subItem) ? "active" : ""
                                                            }`}
                                                        key={key}
                                                    >
                                                        <Link
                                                            className="pc-link"
                                                            to={subItem.link || "#"}
                                                            data-page={subItem.dataPage}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    <li
                                                        className={`pc-item ${isMenuActive(subItem) ? "active" : ""
                                                            }`}
                                                        key={key}
                                                    >
                                                        <Link
                                                            className="pc-link"
                                                            to={subItem.link || "#"}
                                                            data-page={subItem.dataPage}
                                                        >
                                                            aa{subItem.label}
                                                        </Link>
                                                        <ul className="pc-submenu"
                                                            style={{
                                                                display: openMenu[item.id] ? "block" : "none"
                                                            }}>
                                                            {(subItem.submenu || []).map((childItem: any, key: any) => (
                                                                <li className="pc-item" key={key}>
                                                                    <Link className="pc-link" target="_blank" to="/pages/login-v1">
                                                                        {childItem.label}
                                                                    </Link></li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </li>
                                </React.Fragment>
                            )}
                        </>
                    ) : (
                        <React.Fragment>
                            <li className="pc-item pc-caption">
                                <label>{item.label}</label>
                            </li>
                        </React.Fragment>
                    )}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default Sidebar;
