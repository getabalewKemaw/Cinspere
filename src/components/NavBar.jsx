import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Navbar = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);

  // Animate mobile menu
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const navLinks = ["Home", "Favorites"];

  const handleNavClick = (link) => {
    setIsOpen(false);
    if (link === "Favorites") {
      if (!isLoggedIn) onLoginClick("/favorites");
      else navigate("/favorites");
    } else if (link === "Home") {
      navigate("/");
    }
  };

  // Get first 2 letters of user name
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "US";

  return (
    <nav className="w-full bg-dark-100 shadow-md fixed top-0 z-50 max-w-[1200px] ">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="./logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-gradient text-xl font-bold">Cinsphere</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <li
              key={link}
              className="text-light-200 hover:text-white cursor-pointer transition-colors duration-200"
              onClick={() => handleNavClick(link)}
            >
              {link}
            </li>
          ))}

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-light-200 hover:text-white transition-colors duration-200"
              >
                <Icon icon="mdi:account-circle" width="28" height="28" />
                <span className="text-gradient">{userInitials}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-dark-100 rounded-lg shadow-md py-2 w-48 animate-slideDown">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-light-200 hover:text-white w-full text-left transition-colors duration-200"
                  >
                    <Icon
                      icon="mdi:logout"
                      width="20"
                      height="20"
                      className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 shadow-md mr-1"
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onLoginClick("/")}
              className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 shadow-md mr-1"
            >
              Login
            </button>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-light-200 hover:text-white focus:outline-none transition"
        >
          {isOpen ? (
            <Icon icon="mdi:close" width="28" height="28" />
          ) : (
            <Icon icon="mdi:menu" width="28" height="28" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={mobileMenuRef}
        className="md:hidden bg-dark-100 border-t border-dark-300 overflow-hidden"
      >
        <ul className="flex flex-col gap-4 px-5 py-4">
          {navLinks.map((link) => (
            <li
              key={link}
              className="text-light-200 hover:text-white cursor-pointer transition-colors duration-200"
              onClick={() => handleNavClick(link)}
            >
              {link}
            </li>
          ))}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-light-200 hover:text-white transition-colors duration-200"
            >
              <Icon icon="mdi:logout" width="20" height="20" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                onLoginClick("/");
              }}
              className="w-full px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
