import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as mongooseClient from "../../mongooseClient"; // Confirm this is the correct path
import { User } from "../types"; // Make sure the path to types is correct
import './index.css';
import Header from '../Header';

interface ClubData {
    name: string;
    description: string;
    organizer: string; // Only include the fields you need
}

function CreateBookClub() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [clubName, setClubName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await mongooseClient.profile();
                if (!user || !user._id) {
                    alert('You must be logged in to create a club.');
                    navigate('/login');
                } else {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleCreateClub = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!currentUser) {
            alert('No authenticated user. Please log in.');
            return;
        }

        try {
            const clubData: ClubData = {
                name: clubName,
                description: description,
                organizer: currentUser._id  // Set the current user as the organizer
            };
            const response = await mongooseClient.mongoosePost('clubs', clubData); 
            console.log('Club created:', response);
            alert('Club created successfully!');
            console.log("resonse is");
            console.log(response);
            navigate(`/bookclub/${response.clubID}`); // Navigate to the newly created club's page
        } catch (error: any) {
            console.error('Error creating club:', error.message);
            alert('Failed to create club. Please check the console for more details.');
        }
    };

    return (
        <div>
            <Header/>
            <div className='create-club-bg'>
                <div className='border-container'>
                    <div className="create-club-container">
                        <h2>Create Club</h2>
                        <form onSubmit={handleCreateClub}>
                                <input type="text" placeholder="Club Name" value={clubName} onChange={e => setClubName(e.target.value)} />
                                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                                <button type="submit" className='btn'>Create Club</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBookClub;
