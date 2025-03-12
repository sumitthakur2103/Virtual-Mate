import React from 'react'
import "../components/landingFeature.css";

export default function LandingFeature() {
    return (
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
    )
}
