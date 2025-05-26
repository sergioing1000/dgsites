import React, { useState } from "react";
import "./Header.css";
import nasalogo from '../assets/images/nasapower.jpeg'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="brand">
        <a target="_blank" href="https://power.larc.nasa.gov/">
          <img src={nasalogo} alt="nasa power logo"  width={100}/>
        </a>

        <a href="/" className="brand-link">
          Solar APP by Sergio Cruz
        </a>
      </div>

      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <a to="/">Home</a>
        <a to="/about">About</a>
        <a to="/dashboard">Dashboard</a>
        <a to="/contact">Contact</a>
      </nav>

      <button className="menu-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </button>
    </header>
  );
};

export default Header;