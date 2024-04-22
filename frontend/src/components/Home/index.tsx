import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import Header from '../Header';
import background from "../images/homepage-bg.jpeg";
import * as client from '../../mongooseClient'; // Ensure this import points correctly to your client setup
import { User } from '../types'; // Adjust if the path to your types is different

function Home() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userSession = await client.profile(); // This function needs to check if the user is logged in
                setCurrentUser(userSession);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setCurrentUser(null); // Ensures currentUser is null if there's an issue
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="home-font">
            <Header />
            <h1 className='home-heading'>LitCircle</h1>
            <div className='home-signed-out-section' style={{ backgroundImage: `url(${background})` }}>
                <div className="home-content">
                    {currentUser ? (
                        <>
                            <h3>Welcome Back, {currentUser.username}!</h3>
                            <h4>Explore new clubs or books today.</h4>
                        </>
                    ) : (
                        <>
                            <h3>Connecting Minds, One Page at a Time</h3>
                            <h4>Start organizing your club today.</h4>
                        </>
                    )}
                    <Link to='/signup'>
                        <button className='home-sign-up'>Sign Up</button>
                    </Link>
                </div>
            </div>
            <div className='home-search'>
                <Link to='/search-clubs'>
                    <button>Join a Club</button>
                </Link>
                <Link to='/search-books'>
                    <button>Find a Book</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
