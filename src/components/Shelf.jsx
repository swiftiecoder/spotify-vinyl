import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import Loader from "./Loader";
import wrapper1 from "../assets/masks/1.png";
import wrapper2 from "../assets/masks/2.png";
import wrapper3 from "../assets/masks/3.png";
import wrapper4 from "../assets/masks/4.png";
import clamp from "../assets/clamps/2.png";
import html2canvas from "html2canvas";
import axios from "axios";
import "../styles/shelf.css";

export default function Shelf() {
  const [token, setToken] = useState(null);
  const [topItems, setTopItems] = useState(null);
  const [recentItems, setRecentItems] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [username, setUsername] = useState(null);

  const wrappers = [wrapper1, wrapper2, wrapper3, wrapper4];

  useEffect(() => {
    const token1 = window.localStorage.getItem("token");
    const expires = window.localStorage.getItem("expires");
    if (!token1 || Date.now() > expires) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expires");
      navigate("/");
    }

    getUsername(token1);
    getRecentlyPlayed(token1);
    setToken(token1);
  }, []);

  useEffect(() => {
    const expires = window.localStorage.getItem("expires");
    if (Date.now() > expires) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expires");
      navigate("/");
    }
  }, [topItems, recentItems]);

  const navigate = useNavigate();

  const getTopItems = async (term) => {
    setRecentItems(null);
    const data = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_range: term,
        limit: 6,
      },
    });
    setTopItems(data.data.items);
  };

  const getRecentlyPlayed = async (token1 = null) => {
    setTopItems(null);
    const data = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${token ? token : token1}`,
        },
        params: {
          limit: 6,
        },
      }
    );
    setRecentItems(data.data.items);
  };

  const getUsername = async (token1) => {
    const data = await axios
      .get("https://api.spotify.com/v1/me/", {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      })
      .then((response) => {
        setUsername(response.data.display_name);
      })
      .catch((error) => {
        console.log(error);
        setUsername(null);
      });
  };

  const handleLogOut = () => {
    setToken(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expires");
    navigate("/");
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      getRecentlyPlayed();
    } else if (newValue === 1) {
      getTopItems("short_term");
    } else if (newValue === 2) {
      getTopItems("medium_term");
    } else if (newValue === 3) {
      getTopItems("long_term");
    }
  };

  const getRandomWrapper = () => {
    return wrappers[Math.floor(Math.random() * wrappers.length)];
  };

  const handleDownload = async () => {
    const element = document.querySelector(".vinyls");

    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.addEventListener("load", resolve);
            }
          })
      )
    );

    const canvas = await html2canvas(element, { useCORS: true });

    const padding = 50;
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width + padding * 2;
    finalCanvas.height = canvas.height + padding * 5;

    const ctx = finalCanvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    ctx.drawImage(canvas, padding, padding);

    const headerText = username
      ? `${username}'s Vinyl Wall`
      : "Your Vinyl Wall";
    ctx.font = "70px Roboto";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textY = finalCanvas.height - padding * 2;

    ctx.fillText(headerText, finalCanvas.width / 2, textY);

    const link = document.createElement("a");
    link.href = finalCanvas.toDataURL("image/png");
    link.download = "items-snapshot.png";
    link.click();
  };

  return (
    <div>
      {token ? (
        <div>
          <button className="log-out" onClick={handleLogOut}>
            Log Out
          </button>
          <button className="download" onClick={handleDownload}>
            Download
          </button>
          <Box
            className="tabs-container"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tabs
              textColor="inherit"
              TabIndicatorProps={{ style: { display: "none" } }}
              value={selectedTab}
              onChange={handleTabChange}
              className="custom-tabs"
            >
              <Tab label="Recently" />
              <Tab label="Short Term" />
              <Tab label="Medium Term" />
              <Tab label="Long Term" />
            </Tabs>
          </Box>
        </div>
      ) : null}

      {topItems === null && recentItems === null ? <Loader /> : null}

      {token && topItems ? (
          <div className="vinyls">
            {topItems.map((item, index) => (
              <div key={index}>
                <div className="album-art-container">
                  <a
                    href={item.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="album-art"
                      src={item.album.images[0].url}
                      alt={item.name}
                    />
                    <img
                      className="album-art-wrapper"
                      src={getRandomWrapper()}
                      alt="Wrapper"
                    />
                    <img
                      className="album-art-wrapper"
                      src={clamp}
                      alt="Wrapper"
                    />
                  </a>
                </div>
                <h3>{item.name}</h3>
                <p>{item.artists[0].name}</p>
              </div>
            ))}
          </div>
      ) : null}

      {token && recentItems ? (
          <div className="vinyls">
            {recentItems.map((item, index) => (
              <div key={index}>
                <div className="album-art-container">
                  <a
                    href={item.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="album-art"
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                    />
                    <img
                      className="album-art-wrapper"
                      src={getRandomWrapper()}
                      alt="Wrapper"
                    />
                    <img
                      className="album-art-wrapper"
                      src={clamp}
                      alt="Wrapper"
                    />
                  </a>
                </div>
                <h3>{item.track.name}</h3>
                <p>{item.track.artists[0].name}</p>
              </div>
            ))}
          </div>
      ) : null}

      <p className="footer">
        made with 💖 by{" "}
        <a
          className="link"
          href="https://github.com/swiftiecoder"
          target="_blank"
          rel="noopener noreferrer"
        >
          swiftiecoder
        </a>
      </p>
    </div>
  );
}
