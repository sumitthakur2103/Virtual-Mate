import React from "react";
import { useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/home.css";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import RestoreIcon from "@mui/icons-material/Restore";
import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
function HomeComponent() {

    let navigate = useNavigate();

    let handleHome = () => {
        navigate("/");
    }

    return (
        <>

            <div className="feedback-container">
                <div className="header">
                    <h1>Virtual-Mate</h1>
                </div>
                <div className="content">
                    <p>
                    You have left the meeting. Thank you for joining!👋😊✨
                    </p>
                    <button onClick ={handleHome} className="submit-button">Back To Home</button>

                </div>
            </div>

        </>
    );
}

export default withAuth(HomeComponent);