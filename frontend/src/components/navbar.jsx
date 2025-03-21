import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../components/navbar.css";
import { v4 as uuidv4 } from 'uuid';
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

  let handleMenuClick = () => {
    document.querySelector(".menu").classList.toggle("show");
  }

  let newRoomUrl = () => {
    let url = uuidv4();
    navigate("/" + url);
  }
  return (

    <nav className="navbar">
      <div className="logo">Virtual-Mate</div>
      {menuOpen === true ?
        <div>
          <button onClick={handleMenuClick} className='menu-btn'>
            <span className="material-symbols-outlined menu-btn-span toggleBtn">
              menu
            </span>
          </button>

          <div className="menu">
            <Button variant="outlined" onClick={newRoomUrl}>Join As User</Button>
            <Button variant="outlined" onClick={() => navigate("/auth")}>Sign Up</Button>
            <Button variant="contained" onClick={() => navigate("/auth")}>Login</Button>
          </div>
        </div>
        : <div className="nav-links">
          <Button variant="outlined" onClick={newRoomUrl}>Join As User</Button>
          <Button variant="outlined" onClick={() => navigate("/auth")}>Sign Up</Button>
          <Button variant="contained" onClick={() => navigate("/auth")}>Login</Button>
        </div>
      }
    </nav>
  )
}
