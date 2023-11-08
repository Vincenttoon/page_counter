import React from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import { QUERY_ME, QUERY_USER } from "../utils/queries";
import Auth from "../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const { data: me } = useQuery(QUERY_ME);

  const user = data?.me || data?.user || {};

  const navigate = useNavigate();

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  // If page is stuck loading...
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in...
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  return (
    <div className="container">

      <div className="title-container">
        <h2 className="profile-title">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>
        <h4 className="worm-link">Worms: ##</h4>
      </div>

      <div className="stats-container">
        <div className="all-time">
            <h4>Total Pages Read: ##</h4>
        </div>

        <div className="yearly">
            <h4> Yearly Pages Read: ##</h4>
        </div>
      </div>

      <div className="list-container">
        <div className="log-link">
            <p> Logs: ## </p>
        </div>

        <div className="saved-link">
            <p> Stash: ## </p>
        </div>

        <div className="stats-link">
            <p> Stats: Icon </p>
        </div>
      </div>

      <div className="logged-list">
        <div className="example">
            <h2>This is an example</h2>
            <h3>I love this book</h3>
            <p>5.00</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
