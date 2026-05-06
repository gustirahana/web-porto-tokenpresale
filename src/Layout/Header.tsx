import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../toolkit/auth/thunks";
import logo from "../assets/images/logo.png";
import { menuItems } from "./MenuData";
import { FaPowerOff, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (link: string) => location.pathname === link;

  return (
    <header className="dapp-navbar">
      <div className="dapp-navbar-inner">
        {/* Logo */}
        <Link to="/presale" className="dapp-navbar-brand">
          <img src={logo} alt="SP ADST" className="dapp-logo" />
          <span className="dapp-brand-text">SP ADST</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="dapp-nav-links d-none d-md-flex">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`dapp-nav-link ${isActive(item.link) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="dapp-nav-right">
          <button
            className="dapp-logout-btn d-none d-md-flex"
            onClick={handleLogout}
          >
            <FaPowerOff size={13} />
            <span>Logout</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="dapp-mobile-toggle d-md-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="dapp-mobile-menu d-md-none">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`dapp-mobile-link ${isActive(item.link) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <hr className="dapp-divider" />
          <button className="dapp-mobile-logout" onClick={handleLogout}>
            <FaPowerOff size={13} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;