import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to UK Dorm</h1>
            <p>Your gateway to find the perfect accommodation in the UK.</p>
            <div className="home-buttons">
                <Link to="/rooms" className="home-button">Browse Room</Link>
                <Link to="/login" className="home-button">Login</Link>
                <Link to="/register" className="home-button">Register</Link>
            </div>
        </div>
    )
};

export default Home;