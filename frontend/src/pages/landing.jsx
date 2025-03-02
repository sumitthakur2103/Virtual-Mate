import React from 'react'
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className='landingPageContainer'>
      <nav>
        <div className='navHeader'>
          <h2>Apna Video Call</h2>
        </div>
        <div className='navlist'>
          <p onClick={() => {
            router("/guest")
          }}>Join as Guest</p>
          <p onClick={() => {
            router("/auth")
          }}>Register</p>
          
          <div onClick={() => {
            router("/auth")
          }} role='button'>
            <p>Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1><span style={{ color: "#ff9839" }}>Connect</span> With Your Loved Ones</h1>
          <p>Cover a distance with Apna Video Call</p>
          <div role='button'>
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  )
}
