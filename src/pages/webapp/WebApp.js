import React from 'react'
import { useEffect, useState } from 'react';
import HandlePlaylist from './HandlePlaylist';
import './WebApp.css'

const CLIENT_ID = process.env.REACT_APP_CLIENTID;
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI_AFTER_LOGIN = "https://spotifyplaylistmanager.netlify.app";
// "https://spotifyplaylistmanager.netlify.app"
//http://localhost:3000/

const SCOPES = ["playlist-read-private user-follow-read user-library-modify playlist-read-collaborative playlist-modify-private playlist-modify-public"];
const SCOPES_URL_PARAM = SCOPES.join("%20");

const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashTag = hash.substring(1);
    const paramsInURL = stringAfterHashTag.split("&");
    
    const paramsSplitUp = paramsInURL.reduce((accumulator, currentValue) => {
        const[key, value] = currentValue.split("=");
        accumulator[key] = value;
        return accumulator;
    }, {});
    return paramsSplitUp;
};

function WebApp() {
    const [token, setToken] = useState("");

    useEffect(() => {
        if (window.location.hash) {
            const {
                access_token,
                expires_in,
                token_type
            } = getReturnedParamsFromSpotifyAuth(window.location.hash);

            localStorage.clear();
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("tokenType", token_type);
            localStorage.setItem("expiresIn", expires_in);
            setToken(access_token);
        }

    }, []);
    
    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    }
    const handleLogout = () => {
        setToken("");
        window.localStorage.removeItem("accessToken");
        
    }

    return (
        <>
            <div className='webapp-btns'>
                {!token ? 
                    <button className='btn-big' onClick={handleLogin}>Spotify Login</button> :
                    <button className='btn-big' onClick={handleLogout}>Spotify Logout</button>
                }
            </div>
            <div>
            {token &&
                <HandlePlaylist />
            }
                
            </div>
        </>
        
    )
}

export default WebApp
