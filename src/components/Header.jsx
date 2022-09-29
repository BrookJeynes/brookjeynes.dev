import React from 'react';
import '../App.css';

import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const links = {
    'Home': '/',
    'About': '/about',
    'Projects': '/projects',
  }

  return (
    <div className="header-container">
      <span className="header-title"><a href="/">Brook Jeynes</a></span>
      <div className="link-container">
        <Link to='/' className={`${location.pathname === links['Home'] ? "header-link-active" : "header-link"}`}>Home</Link>
        <span>/</span>
        <Link to='/about' className={`${location.pathname === links['About'] ? "header-link-active" : "header-link"}`}>About</Link>
        <span>/</span>
        <Link to='/projects' className={`${location.pathname === links['Projects'] ? "header-link-active" : "header-link"}`}>Projects</Link>
      </div>
    </div>
  );
}

export default Header;
