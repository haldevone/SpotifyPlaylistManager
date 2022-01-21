import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayListCard from './PlayListCard';

const FOLLOWERS_ENDPOINT = "https://api.spotify.com/v1/playlists";

function DisplayPlaylist(props) {

    const [dataFollow, setDataFollow] = useState(null);
    const [showlist, setShowList] = useState(false);

    useEffect(() => {
        getFollowers();
    }, [props.data]);

    const getFollowers = () => {
        let tempFollowers = [];
        // console.log(data);
        props.data.data.items.map(item => {
            axios.get(`${FOLLOWERS_ENDPOINT}/${item.id}`, {
                headers: {
                    Authorization: "Bearer " + props.token,
                },
            })
            .then((res) => {
                tempFollowers.push(res.data);
                
            })
            .catch((error) => {
                console.log(error);
            })
        })
        setDataFollow(tempFollowers);
        // setLoaded(true);
    }

    const show = () => {
        setShowList(true);
    }

  return <>
            <div className='playlist-buttons'>
                <button className='btn-big playlist-btn' onClick={show}>Get Playlist</button>
                <button className='btn-big playlist-btn' onClick={show}>Save To Firebase</button>
            </div>
            <div className='playlist-headers'>
                <h3 className='playlist-header-name'>Playlist</h3>
                <h3 className='playlist-header-track'>Tracks</h3>
                <h3 className='playlist-header-followers'>Followers</h3>
            </div>
        
            {dataFollow && console.log(dataFollow)}
            {showlist && dataFollow.map((item) => 
                        <PlayListCard key={item.id}>
                        <img src={item.images[0].url} alt="" />
                        <p className='playlist-name'>{item.name}</p>
                        <p className='playlist-description'>{item.description}</p>
                        <p className='playlist-tracks'>{item.tracks.total}</p>
                        <p className='playlist-followers'>{item.followers.total}</p>

                        </PlayListCard>
                    )}
  </>
      
}

export default DisplayPlaylist;
