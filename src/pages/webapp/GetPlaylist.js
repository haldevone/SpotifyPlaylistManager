import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './PlayListCard.css'
import DisplayPlaylist from './DisplayPlaylist';

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists/";


function GetPlaylist() {
    const [token, setToken] = useState("");
    const [data, setData] = useState(null);


    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
        
    }, []);
    useEffect(() => {
        GetPlaylist();
    }, [token]);


    const GetPlaylist = () => {
        axios.get(PLAYLIST_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then((response) => {
            setData(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }

   

    return (
        <>
        <div className='playlist-container'>
           {data && <DisplayPlaylist token={token} data={data}/>}
        </div>
        </>
    )
}

export default GetPlaylist

