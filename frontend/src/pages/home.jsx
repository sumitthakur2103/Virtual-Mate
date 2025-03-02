import React from "react";
import { useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import RestoreIcon from "@mui/icons-material/Restore";
import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
function HomeComponent() {

    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    }

    return (
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2>Apna Video Call</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={
                        () =>
                            navigate("/history")
                    }>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>
                    <Button onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth")
                    }}>
                        Logout
                    </Button>
                </div>

                <div className="meetContainer">
                    <div className="leftPanel">
                        <div>
                            <h2>Providing Video Calls</h2>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <TextField onChange={(e) => setMeetingCode(e.target.value)} value={meetingCode} label="Meeting Code" variant="outlined" id="outlined-basic">

                                </TextField>
                                <Button onClick={handleJoinVideoCall} variant="contained">Join</Button>
                            </div>
                        </div>
                    </div>
                    <div className="rightPanel">
                        <img srcSet="/logo3.png" alt="" />
                    </div>

                </div>
            </div>
        </>
    );
}

export default withAuth(HomeComponent);