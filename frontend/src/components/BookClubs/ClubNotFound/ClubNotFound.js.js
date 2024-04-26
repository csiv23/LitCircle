import React from 'react';
import { Link } from 'react-router-dom';

const ClubNotFound = () => {
  return (
    <div>
      <h1>Club Not Found</h1>
      <p>The club you are looking for does not exist or may have been deleted.</p>
      <Link to="/home">Return to Home</Link>
    </div>
  );
};

export default ClubNotFound;
