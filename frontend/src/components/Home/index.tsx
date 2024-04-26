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
          let meetings = await client.getUserNextMeetings(userSession._id);
          // Fetch additional club details for each meeting
          meetings = await Promise.all(
            meetings.map(async (meeting: any) => {
              const clubDetails = await client.getBookClubById(meeting.ClubId);
              console.log(clubDetails);
              return { ...meeting, ...clubDetails, clubId:clubDetails._id};
            })
          );
          setNextMeetings(meetings);
          const followers = await client.getNewFollowers(userSession._id);
          if (followers) {
            setNewFollowers(followers);
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch user profile or additional data:",
          error
        );
        setCurrentUser(null);
        const recentUsersResponse = await client.getRecentUsers();
        setRecentUsers(recentUsersResponse);
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
              <Link to="/login">
                <button className="home-sign-up">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="home-search">
      {(currentUser || recentUsers.length > 0) && (
        <div className="container mt-5">
          {nextMeetings.length > 0 && (
            <div className="home-container">
              <h4>Upcoming Meetings:</h4>
              <div className="row meeting-container">
                {nextMeetings.map((meeting, index) => {
                  const meetingDate = meeting.NextMeetingDate
                    ? new Date(meeting.NextMeetingDate).toLocaleDateString()
                    : "Date not set";
                  return (
                    <div key={`meeting-${index}`} className="col-md-3 mb-3">
                      <div className="card card-meetings">
                        <Link
                            to={`/bookclub/${meeting.clubId}/next-meeting`}
                            className="card-link">
                          <img
                            src={meeting.imageUrl || "path/to/default/image.jpg"}
                            className="card-img-top"
                            alt="Club Image"
                          />
                          <div className="card-body">
                            <h5 className="card-title">
                              {meeting.name || "Club Name"}
                            </h5>
                            <p className="card-text">
                              Next meeting at{" "}
                              {meeting.NextMeetingLocation || "location not set"}{" "}
                              on {meetingDate}
                            </p>
                          </div>
                          </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {newFollowers.length > 0 && (
            <div className="home-container">
              <h4>New Followers:</h4>
              <div className="row">
                {newFollowers.map((follower) => (
                  <div key={follower._id} className="col-md-3 mb-3">
                    <div className="card card-followers">
                    <Link
                          to={`/profile/${follower._id}`}
                          className="card-link">
                      <div className="card-body">
                        
                          {follower.username}
                      </div>
                      </Link>
                    </div>
                   
                  </div>
                ))}
              </div>
            </div>
          )}
          {recentUsers.length > 0 && (
            <div className="home-container">
              <h4>Recent Users:</h4>
              <div className="row">
                {recentUsers.map((user) => (
                  <div key={user._id} className="col-md-3 mb-3">
                    <div className="card card-followers">
                    <Link to={`/profile/${user._id}`} className="card-link">
                      <div className="card-body">
                          {user.username}
                      </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </div>
      <div className="home-search">
        <Link to="/search-clubs">
          <button className="btn btn-primary mr-2">Join a Club</button>
        </Link>
        <Link to="/create-club">
          <button className="btn btn-primary">Create a Club</button>{" "}
        </Link>
        <Link to="/search-books">
          <button className="btn btn-primary mr-2">Find a Book</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
