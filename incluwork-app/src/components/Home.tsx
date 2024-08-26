import React from 'react';
import { Link } from 'react-router-dom';
import './../css/Home.css';


const Home: React.FC = () => {
    return (
        <div className="home-container">
            <div className="center-content">
                <h1>Welcome to Our Application</h1>
                <p>Please login or sign up to continue.</p>
                <div className="buttons">
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                    <Link to="/signup">
                        <button>Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
