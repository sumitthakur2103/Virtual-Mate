import React from 'react'
import "../components/footer.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <Link to="/about"><Button variant="text">About Us</Button></Link>
            <Link to="/contact"><Button variant="text">Contact Us</Button></Link>
            <Link to="/privacy"><Button variant="text">Privacy Policy</Button></Link>
        </footer>
    )
}
