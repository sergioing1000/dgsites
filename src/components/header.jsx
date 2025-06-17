import React, { useState } from "react";
import "./header.css";
import nasalogo from '../assets/images/nasapower.jpeg'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="brand">
        <a target="_blank" rel="noreferrer" href="https://power.larc.nasa.gov/">
          <img src={nasalogo} alt="nasa power logo" width={100} />
        </a>

        <a href="/" className="brand-link">
          Solar APP by Sergio Cruz
        </a>
      </div>

      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/contact">Contact</a>
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