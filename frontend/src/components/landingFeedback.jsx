import React from 'react'
import "../components/landingFeedback.css";
import { TextField, Button } from "@mui/material";


export default function LandingFeedback() {
    return (
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
    )
}
