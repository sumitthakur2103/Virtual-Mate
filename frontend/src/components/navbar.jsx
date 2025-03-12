import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../components/navbar.css";
export default function Navbar() {

  //TODO handle menu open button (handleMenuOpen)


  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(window.innerWidth <= 1025);
  useEffect(() => {
    const handleResize = () => {
      setMenuOpen(window.innerWidth <= 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (

    <nav className="navbar">
      <div className="logo">Virtual-Mate</div>
      {menuOpen === true ?
        <button>
          <span  className="material-symbols-outlined menu-btn toggleBtn">
            menu
          </span>
        </button>
        : <div className="nav-links">
          <Button variant="outlined" onClick={() => navigate("/user")}>Join As User</Button>
          <Button variant="outlined" onClick={() => navigate("/auth")}>Sign Up</Button>
          <Button variant="contained" onClick={() => navigate("/auth")}>Login</Button>
        </div>
      }
    </nav>
  )
}
