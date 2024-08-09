import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Main.css"

export default function Main () {
    const CLIENT_ID = 'cc17510840b444f0b24efecc55e00c67'
    const REDIRECT_URI = 'http://localhost:5173'
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const RESPONSE_TYPE =  'token'
    const SCOPES = 'user-top-read user-read-recently-played'

    const [token, setToken] = useState(null)
    const [topItems, setTopItems] = useState(null)
    const [recentItems, setRecentItems] = useState(null)
    const [refresh, setRefresh] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
    const hash=window.location.hash
    let token = window.localStorage.getItem('token')
    
    console.log(token)

    if(!token && hash) {
        token = hash.split('&')[0].split('=')[1]
        window.localStorage.setItem('token', token)
    }
    setToken(token)
    navigate("/")
    }, [])

    const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
    };

    const handleLogOut = () => {
    setToken(null)
    window.localStorage.removeItem('token')
    navigate("/")
    }

    const getTopItems = async () => {
        const data = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
            "Authorization": `Bearer ${token}`
            }, 
            params: {
            time_range: "short_term",
            limit: 6
            }
            })
            setTopItems(data.data.items)
            setRecentItems(null)
    }

    const getRecentlyPlayed = async () => {
        const data = await axios.get("https://api.spotify.com/v1/me/player/recently-played", {
            headers: {
            "Authorization": `Bearer ${token}`
            }, 
            params: {
            limit: 6
            }
            })
            setRecentItems(data.data.items)
            setTopItems(null)
    }

    return ( 
    <>
        <h1>Spotify App</h1>
        {!token ? 
        <button onClick={handleLogin}>Log In to Spotify</button>
        :
        <>
            <button onClick={handleLogOut}>Log Out</button>
            <button onClick={getTopItems}>Get Top Items</button>
            <button onClick={getRecentlyPlayed}>Get Recent Items</button>
        </>
        }

        {token && topItems ? 
            <div className="vinyls">
                {topItems.map((item, index) => {
                return (
                    <div key={index}>
                    <img className="album-art" src={item.album.images[0].url} alt={item.name}/>
                    <h3>{item.name}</h3>
                    <p>{item.artists[0].name}</p>
                    </div>
                )
                })}
            </div>
        : null
        }
        
        {token && recentItems ?
            <div className="vinyls">
                {recentItems.map((item, index) => {
                return (
                    <div key={index}>
                    <img className="album-art" src={item.track.album.images[0].url} alt={item.track.name}/>
                    <h3>{item.track.name}</h3>
                    <p>{item.track.artists[0].name}</p>
                    </div>
                )}
                )}
            </div>
        : null
        }
    </>
    )
}