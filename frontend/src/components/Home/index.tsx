import './index.css';
import Header from '../Header';
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import background from "../images/homepage-bg.jpeg"

function Home() {
    return (
        <div className="home-font">
            <Header/>
            <h1 className='home-heading'>LitCircle</h1>
            <div className='home-signed-out-section' style={{ backgroundImage: `url(${background})` }}>
                <div className="home-content">
                    <h3>Connecting Minds, One Page at a Time</h3>
                    <h4>Start organizing your club today.</h4>
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
    )
}

export default Home;