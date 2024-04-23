import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import Header from "../Header";
import background from "../images/homepage-bg.jpeg";
import * as client from "../../mongooseClient";
import { User, NextMeeting } from "../types";

function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nextMeetings, setNextMeetings] = useState<NextMeeting[]>([]);
  const [newFollowers, setNewFollowers] = useState<User[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchProfileAndRelatedData = async () => {
      try {
        const userSession = await client.profile();
        if (userSession && userSession._id) {
          setCurrentUser(userSession);
          const meetings = await client.getUserNextMeetings(userSession._id);
          setNextMeetings(meetings);
          const followers = await client.getNewFollowers(userSession._id);
          setNewFollowers(followers);
        }
      } catch (error) {
        if ((error as any).response && (error as any).response.status === 401) {
          // User is not authenticated, set current user to null
          setCurrentUser(null);
          // Fetch recent users instead
          const recentUsersResponse = await client.getRecentUsers();
          console.log("Recent Users Response");
          console.log(recentUsersResponse);
          setRecentUsers(recentUsersResponse);
        } else {
          console.error(
            "Failed to fetch user profile or additional data:",
            error
          );
          setCurrentUser(null);
        }
      }
    };

    fetchProfileAndRelatedData();
  }, []);

  return (
    <div className="home-font">
      <Header />
      <h1 className="home-heading">LitCircle</h1>
      <div
        className="home-signed-out-section"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="home-content">
          {currentUser ? (
            <>
              <h3>Welcome Back, {currentUser.username}!</h3>
              <h4>Start organizing your club today.</h4>
            </>
          ) : (
            <>
              <h3>Connecting Minds, One Page at a Time</h3>
              <h4>Start organizing your club today.</h4>
              <Link to="/signup">
                <button className="home-sign-up">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* New section for both signed-in content and recent users */}
      {(currentUser || recentUsers.length > 0) && (
        <div className="container mt-5">
          {/* Display upcoming meetings */}
          {nextMeetings.length > 0 && (
            <div>
              <h4>Upcoming Meetings:</h4>
              <div className="row">
                {nextMeetings.map((meeting) => (
                  <div
                    key={meeting.NextMeetingDate.toString()}
                    className="col-md-3 mb-3"
                  >
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          Next meeting at {meeting.NextMeetingLocation} on{" "}
                          {new Date(meeting.NextMeetingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Display new followers */}
          {newFollowers.length > 0 && (
            <div className="mt-5">
              <h4>New Followers:</h4>
              <div className="row">
                {newFollowers.map((follower) => (
                  <div key={follower._id} className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <Link
                          to={`/profile/${follower._id}`}
                          className="card-link"
                        >
                          {follower.username}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Display recent users */}
          {recentUsers.length > 0 && (
            <div className="mt-5">
              <h4>Recent Users:</h4>
              <div className="row">
                {recentUsers.map((user) => (
                  <div key={user._id} className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <Link
                          to={`/profile/${user._id}`}
                          className="card-link"
                        >
                          {user.username}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Buttons section */}
      <div className="home-search mt-5">
        <Link to="/search-clubs">
          <button className="btn btn-primary mr-2">Join a Club</button>
        </Link>
        <Link to="/search-books">
          <button className="btn btn-primary">Find a Book</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
