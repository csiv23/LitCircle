import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header';

const ClubNotFound = () => {
  return (
    <div className='club-font'>
      <Header/>
      <div className='club-bg'>
        <h1>Club Not Found</h1>
        <p>The club you are looking for does not exist or may have been deleted.</p>
        <Link to="/home">Return to Home</Link>
      </div>
    </div>
  );
};

export default ClubNotFound;
