import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './PlayListCard.css'
import DisplayPlaylist from './DisplayPlaylist';
import { useAuthContext } from '../../hooks/useAuthContext';
import useFirestore from '../../hooks/useFirestore';
import { Timestamp } from 'firebase/firestore';
import ListBase from '../listBase/ListBase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useCollection } from '../../hooks/useCollection';
import PlaylistCopy from './PlaylistCopy';

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists/";


function HandlePlaylist() {
    const [token, setToken] = useState("");
    const [data, setData] = useState(null);
    const [showList, setShowList] = useState(false);
    const [switchListbase, setSwitchListbase] = useState(false);
    const [switchListCopy, setSwitchListCopy] = useState(false);
    const [dataComplete, setDataComplete] = useState(null);
    const { user } = useAuthContext();
    const {addDocument, response} = useFirestore('playlists');
    const { documents, error } = useCollection('playlists', 'createdAt', ['uid', '==', user.uid])

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
        
    }, []);
    useEffect(() => {
        GetPlaylist();
    }, [token]);

    useEffect(() => {

    }, [response, dataComplete]);


    const GetPlaylist = () => {
        // console.log("getting playlist");
        axios.get(PLAYLIST_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then((response) => {
            setData(response);
            // console.log(response)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleCallback = (childData) => {
        setDataComplete(childData);
    }

    function handleChildShow(){
        documents && setShowList(true);
    }

    const handleSaveToFirebase = () => {
        const createdAt = Timestamp.fromDate(new Date()).toDate();

        if (dataComplete) {
            addDocument({
                uid: user.uid,
                playlist: dataComplete.map((item) => {
                    return {
                        name: item.name,
                        tracks: item.tracks.total,
                        followers: item.followers.total
                    }
                }),
                createdAt
            });
        }
    }

    return (
        <>
        <div className='playlist-container'>
        {response.success && <p className='playlist-message'>Saved To Database!</p>}
            <div className='playlist-buttons'>
                {(!switchListbase && !switchListCopy) ? <button className='btn-big playlist-btn' onClick={() => handleChildShow()}>Get Playlist</button> :
                <button className='btn-big playlist-btn' onClick={() => window.location.reload(false)}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back</button>}
                {(dataComplete && !switchListbase && !switchListCopy) &&
                <div>
                    <button className='btn-big playlist-btn' onClick={handleSaveToFirebase}>Save To Database</button>
                    <button className='btn-big playlist-btn' onClick={() => setSwitchListbase(true)}>Compare Database</button>
                </div>}
                <button className='btn-big playlist-btn' onClick={() => setSwitchListCopy(true)}>Copy Playlists</button>
            </div>
            {switchListCopy ? <PlaylistCopy data={data} token={token}/> : (switchListbase ? <ListBase dataComplete={dataComplete}/> : 
           (data && <DisplayPlaylist 
           token={token} 
           data={data} 
           ParentData={handleCallback}
           showList={showList}
           />))}
        </div>
        </>
    )
}

export default HandlePlaylist

