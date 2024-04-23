import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import Header from '../Header';
import background from "../images/homepage-bg.jpeg";
import * as client from '../../mongooseClient'; // Make sure this import is correctly pointing to your client setup
import { User, NextMeeting } from '../types'; // Assuming you've imported the correct types

function Home() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [nextMeetings, setNextMeetings] = useState<NextMeeting[]>([]);

    useEffect(() => {
        const fetchProfileAndRelatedData = async () => {
            try {
                const userSession = await client.profile(); // Fetch current user profile
                setCurrentUser(userSession);
                if (userSession && userSession._id) {
                    const meetings = await client.getUserNextMeetings(userSession._id);
                    setNextMeetings(meetings);
                    // Add more data fetching here if necessary
                }
            } catch (error) {
                console.error("Failed to fetch user profile or additional data:", error);
                setCurrentUser(null);
            }
        };
        fetchProfileAndRelatedData();
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
                            <h4>Here's your upcoming agenda:</h4>
                            {
                            nextMeetings.length > 0 ? (
                                <ul>
                                    {nextMeetings.map(meeting => (
                                        <li key={meeting.NextMeetingDate.toString()}>
                                            Next meeting at {meeting.NextMeetingLocation} on {new Date(meeting.NextMeetingDate).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No upcoming meetings scheduled.</p>
                            )}
                        </>
                    ) : (
                        <>
                            <h3>Connecting Minds, One Page at a Time</h3>
                            <h4>Start organizing your club today.</h4>
                            <Link to='/signup'>
                                <button className='home-sign-up'>Sign Up</button>
                            </Link>
                        </>
                    )}
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
