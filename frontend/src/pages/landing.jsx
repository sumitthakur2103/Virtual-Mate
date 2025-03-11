import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "../styles/landing.css"; // Import CSS file
import { TextField } from "@mui/material";

export default function LandingPage() {
  const navigate = useNavigate();
  const handleMenuOpen = () => {
    document.getElementById("animatedDiv").classList.toggle("active");
  };
  const [menuOpen, setMenuOpen] = useState(window.innerWidth <= 1025);
  useEffect(() => {
    const handleResize = () => {
      setMenuOpen(window.innerWidth <= 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="container">

      <div className="hero-container">

        <nav className="navbar">
          <div className="logo">Virtual-Mate</div>
          {menuOpen === true ?
            <button>
  
              <span onClick={handleMenuOpen} className="material-symbols-outlined menu-btn toggleBtn">
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
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Connect,<br /> Collaborate,<br /> Communicate,<br /> Seamlessly</h1>
            <Button variant="contained" color="primary" onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="features">
        <h2>Connect, Share, and Chat—All in One Place!</h2>
        <div className="feature-images">
          <div className="feature-box">
            <div className="feature-box-img" id="img1"></div>
            <div className="feature-box-p">
              Connect with crystal-clear video for seamless virtual meetings. 🎥✨
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-box-img" id="img2"></div>
            <div className="feature-box-p">
              Share your screen effortlessly for presentations and collaboration. 🖥️🚀
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-box-img" id="img3"></div>
            <div className="feature-box-p">
              Stay connected with instant messaging during meetings. 💬⚡
            </div>
          </div>
        </div>
      </section>

      <section className="feedback-box">
        <div className="feedback">
          <div className="feedback-text">
            <div>
              <h3>Rate it, hate it,</h3>
              <h3>love it—just say it!</h3>
            </div>
            <p>Your feedback = our superpower!</p>
          </div>
          <div className="feedback-input">
            <TextField id="filled-multiline" label="Share your thoughts..." variant="filled" multiline rows={3} className="feedback-input-area" />

            <Button variant="contained" color="secondary">Drop Feedback</Button>
          </div>
        </div>
      </section>


      {/* Footer Section */}
      <footer className="footer">
        <Link to="/about"><Button variant="text">About Us</Button></Link>
        <Link to="/contact"><Button variant="text">Contact Us</Button></Link>
        <Link to="/privacy"><Button variant="text">Privacy Policy</Button></Link>
      </footer>
    </div>
  );
}