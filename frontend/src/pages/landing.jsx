import React, { useState, useEffect } from "react";
import "../styles/landing.css"; // Import CSS file
import Navbar from "../components/navbar";
import LandingHero from "../components/landingHero";
import LandingFeature from "../components/landingFeature";
import Footer from "../components/footer";
export default function LandingPage() {


  return (
    <div className="container">

      <div className="hero-container">
        <Navbar />
        <LandingHero />
      </div>

      {/* Features Section */}
      <LandingFeature />


      {/* Footer Section */}
      <Footer />

    </div>
  );
}