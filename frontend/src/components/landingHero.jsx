import React from 'react'
import "../components/landingHero.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function LandingHero() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Connect,<br /> Collaborate,<br /> Communicate,<br /> Seamlessly</h1>
                <Button variant="contained" color="primary" onClick={() => navigate("/auth")}>Get Started</Button>
            </div>
        </section>
    )
}
