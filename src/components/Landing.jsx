import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/landing.css";

export default function Landing() {
  const CLIENT_ID = "cc17510840b444f0b24efecc55e00c67";
  const REDIRECT_URI = "http://localhost:5173";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read user-read-recently-played user-read-email";

  const [token, setToken] = useState(null);
  const [topItems, setTopItems] = useState(null);
  const [recentItems, setRecentItems] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.split("&")[0].split("=")[1];
      window.localStorage.setItem("token", token);
    }
    setToken(token);

    if (token) {
      navigate("/wall");
    }
  }, []);

  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  };

  return (
    <div className="main-container">
      <h1 className="title">Create Your Vinyl Wall</h1>
      {
        !token ? (
          <button className="login-button" onClick={handleLogin}>
            Log In to Spotify
          </button>
        ) : (
          <button
            onClick={() => {
              navigate("/wall");
            }}
          >
            Go to Wall
          </button>
        )
        // : null
      }
      <p className="footer">
        made with 💖 by{" "}
        <a
          className="link"
          href="https://github.com/swiftiecoder"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          swiftiecoder
        </a>
      </p>
    </div>
  );
}
